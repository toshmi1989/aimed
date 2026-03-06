from sqlalchemy.ext.asyncio import AsyncSession
from models.clinical import TriageRequestModel, ClinicalReasoningResponse
from services.rag_engine import MedicalRAGEngine
from services.clinical_graph import ClinicalGraphEngine
from services.safety_engine import SafetyGuardrailEngine

class ClinicalReasoningEngine:
    def __init__(self):
        self.rag = MedicalRAGEngine()
        self.graph = ClinicalGraphEngine()
        
    async def process_reasoning(self, request: TriageRequestModel, db_session: AsyncSession) -> ClinicalReasoningResponse:
        symptoms_str = " ".join(request.symptoms).lower()
        severity = str(request.anamnesis.get("severity", "moderate")).lower()
        
        # 1. SAFETY GUARDRAIL: Emergency Detection (Absolute Priority)
        is_emergency = SafetyGuardrailEngine.detect_emergency(request.symptoms)
        
        # 2. ONTOLOGY GRAPH: Structured Symptom Mapping
        graph_data = self.graph.query_symptoms(request.symptoms)
        
        # 3. KNOWLEDGE RAG: Semantic Medical Search
        search_query = symptoms_str
        retrieved_docs = await self.rag.search_clinical_guidelines(
            query=search_query, 
            session=db_session, 
            top_k=2
        )
        
        context_str = ""
        references = []
        for doc in retrieved_docs:
            context_str += f"- [{doc['source']}] {doc['title']}: {doc['content']}\n"
            references.append(doc['source'])

        # 4. PREPARE RESPONSES (Mock LLM)
        # In MVP, we synthesize graph_data, rag_data, and safety evaluation directly.
        
        risk_level = "moderate"
        causes = graph_data["possible_conditions"] if graph_data["possible_conditions"] else ["Observation required"]
        specialist = "General Practitioner"
        tests = graph_data["recommended_tests"] if graph_data["recommended_tests"] else ["Basic metabolic panel"]
        
        if is_emergency or severity in ["severe", "10", "emergency"]:
            risk_level = "emergency"
            specialist = "Emergency Services"
            if not causes:
                causes = ["Life-threatening event requiring immediate evaluation"]
                
        # 5. SAFETY GUARDRAIL: LLM Diagnosis Blocking
        # We simulate the LLM outputting definitive terms, then passing it through the filter
        mock_raw_llm_assessment = f"Based on the analysis, you have {', '.join(request.symptoms)}. "
        mock_raw_llm_assessment += f"Body systems affected: {', '.join(graph_data['systems']) if graph_data['systems'] else 'Unknown'}. "
        
        # Apply filter
        safe_assessment = SafetyGuardrailEngine.block_definitive_diagnosis(mock_raw_llm_assessment)
        
        advice = "Monitor symptoms closely."
        if risk_level == "emergency":
            advice = "Immediate medical evaluation is required. Do not delay."
            
        # 6. SAFETY GUARDRAIL: Medical Disclaimer Injection
        safe_advice = SafetyGuardrailEngine.inject_medical_disclaimer(advice)

        # 7. SAFETY GUARDRAIL: Hallucination Tracking (Missing RAG Sources = Low Confidence)
        if not references:
            safe_assessment += "\n\n(Low Confidence: No matching clinical guidelines found in local RAG database.)"
        else:
            safe_assessment += f"\n\nClinical References utilized: {', '.join(set(references))}"

        return ClinicalReasoningResponse(
            assessment=safe_assessment,
            possible_causes=causes,
            recommended_tests=tests,
            risk_level=risk_level,
            specialist=specialist,
            treatment_advice=safe_advice,
            body_systems=graph_data["systems"]
        )
