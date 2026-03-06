from sqlalchemy.ext.asyncio import AsyncSession
from models.clinical import TriageRequestModel, ClinicalReasoningResponse
from services.rag_engine import MedicalRAGEngine

CLINICAL_PROMPT_TEMPLATE = """
You are a clinical decision support AI.

Use structured clinical reasoning.
Step 1 - summarize symptoms
Step 2 - produce differential diagnosis
Step 3 - assess risk level
Step 4 - recommend tests
Step 5 - recommend specialist if needed

Patient Anamnesis: {anamnesis}
Symptoms: {symptoms}
Lab Results: {lab_results}

Retrieved Clinical Guidelines:
{clinical_context}

Ensure your response is strictly formatted. Do not provide a definitive diagnosis.
"""

class ClinicalReasoningEngine:
    def __init__(self):
        self.rag = MedicalRAGEngine()
        
    async def process_reasoning(self, request: TriageRequestModel, db_session: AsyncSession) -> ClinicalReasoningResponse:
        symptoms_str = " ".join(request.symptoms).lower()
        severity = str(request.anamnesis.get("severity", "moderate")).lower()
        
        # 1. Retrieve Knowledge via RAG
        # We search the vector database using the primary symptoms combined
        search_query = symptoms_str
        retrieved_docs = await self.rag.search_clinical_guidelines(
            query=search_query, 
            session=db_session, 
            top_k=2
        )
        
        # Format the retrieved docs for the LLM prompt (mocked below)
        context_str = ""
        references = []
        for doc in retrieved_docs:
            context_str += f"- [{doc['source']}] {doc['title']}: {doc['content']}\n"
            references.append(doc['source'])
            
        if not context_str:
            context_str = "No specific guidelines found in internal database."

        # 2. Mock LLM Clinical Reasoning Evaluation
        risk_level = "moderate"
        causes = ["Viral infection (e.g. Influenza)", "Bacterial infection (e.g. Bronchitis)"]
        specialist = "General Practitioner"
        tests = ["Complete Blood Count (CBC)", "C-Reactive Protein (CRP)"]
        
        # We adjust our mock depending on what RAG found
        if "chest pain" in symptoms_str or severity in ["severe", "10", "emergency"]:
            risk_level = "emergency"
            causes = ["Myocardial Infarction", "Pulmonary Embolism", "Severe Angina"]
            specialist = "Emergency Services / Cardiologist"
            tests = ["ECG", "Troponin", "D-dimer"]
        
        assessment = f"Patient presents with {request.symptoms}. "
        assessment += f"Condition duration is reported as {request.anamnesis.get('duration', 'unknown')} with {severity} severity. "
        
        if request.lab_results:
            assessment += "Lab results were considered in this evaluation. "

        advice = "Monitor symptoms closely. Seek emergency medical attention if condition worsens rapidly."
        if risk_level == "emergency":
            advice = "Immediate medical evaluation is required. Do not delay."

        # Include Clinical References from RAG in the advice / assessment or a new field
        # For MVP we append it to the assessment narrative
        if references:
            assessment += f"\n\nClinical References utilized: {', '.join(set(references))}"

        return ClinicalReasoningResponse(
            assessment=assessment,
            possible_causes=causes,
            recommended_tests=tests,
            risk_level=risk_level,
            specialist=specialist,
            treatment_advice=advice
        )
