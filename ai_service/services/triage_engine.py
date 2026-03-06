from models.consultation import TriageRequest, TriageResponse

# Mock Triage Engine implementation
# In a real scenario, this would format the prompt and call an LLM (OpenAI/Anthropic)
# using the medical_triage_prompt.txt

class TriageEngine:
    async def process_triage(self, request: TriageRequest) -> TriageResponse:
        
        # Simple rule-based mock for testing emergency escalation
        severity = request.anamnesis.get("severity", "").lower()
        symptom_str = " ".join(request.symptoms).lower()
        
        if "chest pain" in symptom_str or severity in ["severe", "10", "emergency"]:
            return TriageResponse(
                possible_causes=["Myocardial Infarction", "Pulmonary Embolism", "Severe Angina"],
                risk_level="emergency",
                next_questions=[],
                recommended_action="Call emergency services immediately."
            )
            
        # Default mock response
        return TriageResponse(
            possible_causes=["Viral Infection", "Upper Respiratory Tract Infection"],
            risk_level="moderate",
            next_questions=[
                "Have you been exposed to anyone who is currently sick?",
                "Do you have a fever? If so, what is your temperature?"
            ],
            recommended_action="Continue to monitor symptoms. Hydrate and rest. Book a consultation if symptoms worsen."
        )
