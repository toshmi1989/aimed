from models.lab import LabAnalyzeRequest, LabAnalyzeResponse, LabValueResult

# Hardcoded reference ranges for the MVP
# Structure: { "test_name": {"unit": "...", "female": [min, max], "male": [min, max]} }
LAB_REFERENCE_RANGES = {
    "hemoglobin": {
        "unit": "g/dL",
        "male": [13.5, 17.5],
        "female": [12.0, 15.5]
    },
    "leukocytes": {
        "unit": "x10³/µL",
        "default": [4.0, 11.0]
    },
    "glucose": {
        "unit": "mmol/L",
        "default": [3.9, 5.5]
    },
    "alt": {
        "unit": "U/L",
        "male": [10, 40],
        "female": [7, 35]
    },
    "ast": {
        "unit": "U/L",
        "default": [10, 40]
    }
}

class LabInterpreterEngine:
    async def process_labs(self, request: LabAnalyzeRequest) -> LabAnalyzeResponse:
        results = []
        abnormal_values = []
        
        sex = request.patient_info.sex.lower()
        
        # 1. Deterministic Evaluation against Reference Ranges
        for test_name, value in request.lab_values.items():
            key = test_name.lower()
            if key in LAB_REFERENCE_RANGES:
                ref = LAB_REFERENCE_RANGES[key]
                unit = ref["unit"]
                
                # Determine range based on sex if available, else default
                if sex in ref:
                    min_val, max_val = ref[sex]
                elif "default" in ref:
                    min_val, max_val = ref["default"]
                else:
                    # Fallback
                    min_val, max_val = 0, 9999
                    
                status = "normal"
                if value < min_val:
                    status = "low"
                    abnormal_values.append(f"{test_name} (low)")
                elif value > max_val:
                    status = "high"
                    abnormal_values.append(f"{test_name} (high)")
                    
                results.append(LabValueResult(
                    test_name=test_name,
                    value=value,
                    unit=unit,
                    status=status,
                    reference_range=f"{min_val} - {max_val}"
                ))
            else:
                # Unknown lab test
                results.append(LabValueResult(
                    test_name=test_name,
                    value=value,
                    unit="unknown",
                    status="unknown",
                    reference_range="unknown"
                ))
                
        # 2. Mock LLM Interpretation pipeline based on clinical flags
        # In production this would format a prompt with `results` and call OpenAI/Anthropic
        interpretation = "All provided lab values are within normal clinical ranges."
        causes = []
        recommended = []
        specialist = "General Practitioner"
        
        if abnormal_values:
            interpretation = "Some values are outside the normal range and require clinical attention."
            abnormal_str = " ".join(abnormal_values).lower()
            
            if "hemoglobin (low)" in abnormal_str:
                causes.extend(["Iron deficiency anemia", "Chronic disease", "Blood loss"])
                recommended.extend(["Ferritin", "Iron panel", "Reticulocyte count"])
                specialist = "Hematologist"
            
            if "leukocytes (high)" in abnormal_str:
                causes.append("Active infection or systemic inflammation")
                recommended.append("C-Reactive Protein (CRP)")
                
            if "glucose (high)" in abnormal_str:
                causes.append("Prediabetes or Diabetes Mellitus")
                recommended.extend(["HbA1c", "Fasting insulin test"])
                specialist = "Endocrinologist"

        return LabAnalyzeResponse(
            results=results,
            abnormal_values=abnormal_values,
            interpretation=interpretation,
            possible_causes=causes,
            recommended_tests=recommended,
            doctor_specialist=specialist
        )
