from fastapi import APIRouter, Depends, HTTPException
from models.lab import LabAnalyzeRequest, LabAnalyzeResponse
from services.lab_interpreter import LabInterpreterEngine

router = APIRouter(
    prefix="/labs",
    tags=["Lab Analysis"]
)

def get_lab_interpreter():
    return LabInterpreterEngine()

@router.post("/analyze", response_model=LabAnalyzeResponse)
async def analyze_labs(
    request: LabAnalyzeRequest,
    engine: LabInterpreterEngine = Depends(get_lab_interpreter)
):
    """
    Analyze structured lab values against reference ranges.
    Returns deterministic status and mock LLM clinical interpretation.
    """
    try:
        response = await engine.process_labs(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
