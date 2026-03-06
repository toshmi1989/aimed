from models.clinical import TriageRequestModel, ClinicalReasoningResponse

# Prompt template structure placeholder for the MVP
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

Ensure your response is strictly formatted. Do not provide a definitive diagnosis.
"""

class ClinicalReasoningEngine:
    async def process_reasoning(self, request: TriageRequestModel) -> ClinicalReasoningResponse:
        
        # Simplified risk evaluation mock
        symptoms_str = " ".join(request.symptoms).lower()
        severity = str(request.anamnesis.get("severity", "moderate")).lower()
        
        # Default mock base
        risk_level = "moderate"
        causes = ["Viral infection (e.g. Influenza)", "Bacterial infection (e.g. Bronchitis)"]
        specialist = "General Practitioner"
        tests = ["Complete Blood Count (CBC)", "C-Reactive Protein (CRP)"]
        
        # Risk Evaluation Rules
        if any(w in symptoms_str for w in ["chest pain", "shortness of breath", "sweating"]) or severity in ["severe", "10", "emergency"]:
            risk_level = "emergency"
            causes = ["Myocardial Infarction", "Pulmonary Embolism", "Severe Angina"]
            specialist = "Emergency Services / Cardiologist"
            tests = ["ECG", "Troponin", "D-dimer"]
        
        # Generate the structured response
        assessment = f"Patient presents with {len(request.symptoms)} reported symptoms including {', '.join(request.symptoms)}. "
        assessment += f"Condition duration is reported as {request.anamnesis.get('duration', 'unknown')} with {severity} severity. "
        
        if request.lab_results:
            assessment += "Lab results are available for review. "
            
        advice = "Monitor symptoms closely. Seek emergency medical attention if condition worsens rapidly."
        if risk_level == "emergency":
            advice = "Immediate medical evaluation is required. Do not delay."

        # In production, we would inject CLINICAL_PROMPT_TEMPLATE into an LLM call here,
        # parsing its structured JSON output into this ClinicalReasoningResponse model.
        
        return ClinicalReasoningResponse(
            assessment=assessment,
            possible_causes=causes,
            recommended_tests=tests,
            risk_level=risk_level,
            specialist=specialist,
            treatment_advice=advice
        )
