from fastapi import APIRouter, Depends, HTTPException
from models.clinical import TriageRequestModel, ClinicalReasoningResponse
from services.clinical_reasoning import ClinicalReasoningEngine

router = APIRouter(
    prefix="/clinical",
    tags=["Clinical Reasoning"]
)

def get_clinical_engine():
    return ClinicalReasoningEngine()

@router.post("/reason", response_model=ClinicalReasoningResponse)
async def perform_reasoning(
    request: TriageRequestModel,
    engine: ClinicalReasoningEngine = Depends(get_clinical_engine)
):
    """
    Advanced Clinical Reasoning module.
    Takes symptoms, anamnesis, and optional lab results to produce
    a comprehensive differential diagnosis, risk scoring, and specialist referral.
    """
    try:
        response = await engine.process_reasoning(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
