from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db_session
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
    engine: ClinicalReasoningEngine = Depends(get_clinical_engine),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Advanced Clinical Reasoning module powered by Medical RAG.
    Takes symptoms, anamnesis, and optional lab results, queries pgvector
    for relevant medical guidelines, and produces a structured physician output.
    """
    try:
        response = await engine.process_reasoning(request, db_session=db)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
