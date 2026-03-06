from fastapi import APIRouter, Depends, HTTPException
from models.consultation import TriageRequest, TriageResponse
from services.triage_engine import TriageEngine
import uuid

router = APIRouter(
    prefix="/triage",
    tags=["Consultation Triage"]
)

# Dependency injection for the engine
def get_triage_engine():
    return TriageEngine()

@router.post("/", response_model=TriageResponse)
async def perform_triage(
    request: TriageRequest, 
    engine: TriageEngine = Depends(get_triage_engine)
):
    """
    Perform a medical triage based on symptoms and anamnesis state.
    Returns differential diagnosis, risk level, and next questions.
    """
    try:
        response = await engine.process_triage(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
