EMERGENCY_SYMPTOMS = [
    "severe chest pain",
    "difficulty breathing",
    "shortness of breath",
    "loss of consciousness",
    "fainting",
    "stroke",
    "paralysis",
    "sudden severe headache",
    "thunderclap headache",
    "heavy bleeding",
    "suicidal thoughts"
]

class SafetyGuardrailEngine:
    @staticmethod
    def detect_emergency(symptoms: list[str]) -> bool:
        """
        Guardrail 1: Hardcoded override for life-threatening symptoms.
        Bypasses LLM reasoning to force immediate action.
        """
        combined_symptoms = " ".join(symptoms).lower()
        for emergency in EMERGENCY_SYMPTOMS:
            if emergency in combined_symptoms:
                return True
        return False

    @staticmethod
    def block_definitive_diagnosis(llm_response_text: str) -> str:
        """
        Guardrail 2: Prevents the AI from diagnosing a patient.
        Replaces definitive statements with probabilistic medical phrasing.
        """
        blocked_phrases = [
            ("you have", "you may have"),
            ("this means you have", "this suggests you might have"),
            ("diagnosis:", "possible differential diagnosis includes:")
        ]
        
        safe_response = llm_response_text
        for bad_phrase, safe_replacement in blocked_phrases:
            safe_response = safe_response.replace(bad_phrase, safe_replacement)
            # handle capitalized versions
            safe_response = safe_response.replace(bad_phrase.capitalize(), safe_replacement.capitalize())
            
        return safe_response

    @staticmethod
    def inject_medical_disclaimer(advice: str) -> str:
        """
        Guardrail 3: Injects legal and medical disclaimers universally.
        """
        disclaimer = " [Disclaimer: This information is for educational purposes and does not replace the advice of a licensed physician.]"
        if "licensed physician" not in advice.lower():
            return advice + disclaimer
        return advice
