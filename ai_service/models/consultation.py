from pydantic import BaseModel, Field
from typing import List, Optional

class TriageRequest(BaseModel):
    symptoms: List[str] = Field(..., description="List of primary symptoms")
    anamnesis: dict = Field(..., description="State machine containing age, sex, symptom duration, severity, etc.")

class TriageResponse(BaseModel):
    possible_causes: List[str] = Field(..., description="List of differential diagnoses")
    risk_level: str = Field(..., description="low, moderate, urgent, emergency")
    next_questions: List[str] = Field(..., description="Follow-up questions to ask the patient")
    recommended_action: str = Field(..., description="Action to recommend: home care, doctor visit, etc.")
