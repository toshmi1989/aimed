from pydantic import BaseModel, Field
from typing import Dict, List, Optional

class PatientInfo(BaseModel):
    age: int
    sex: str = Field(..., description="Biological sex for reference ranges: 'male' or 'female'")

class LabAnalyzeRequest(BaseModel):
    lab_values: Dict[str, float] = Field(..., description="Key-value pairs of lab test names and their numeric values")
    patient_info: PatientInfo
    
class LabValueResult(BaseModel):
    test_name: str
    value: float
    unit: str
    status: str = Field(..., description="'low', 'normal', 'high', or 'unknown'")
    reference_range: str

class LabAnalyzeResponse(BaseModel):
    results: List[LabValueResult]
    abnormal_values: List[str]
    interpretation: str
    possible_causes: List[str]
    recommended_tests: List[str]
    doctor_specialist: str
