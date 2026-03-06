from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TriageRequestModel(BaseModel):
    symptoms: List[str]
    anamnesis: Dict[str, Any]
    lab_results: Optional[Dict[str, Any]] = None

class ClinicalReasoningResponse(BaseModel):
    assessment: str = Field(..., description="Clinical narrative assessment of the patient's condition")
    possible_causes: List[str] = Field(..., description="Differential diagnoses")
    recommended_tests: List[str] = Field(..., description="Lab or imaging tests to recommend")
    risk_level: str = Field(..., description="emergency, urgent, moderate, low_risk")
    specialist: str = Field(..., description="Recommended medical specialist")
    treatment_advice: str = Field(..., description="General advice or home care instructions")
