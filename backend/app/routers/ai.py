from fastapi import APIRouter
from app.schemas.ai import AIAnalyzeRequest, AIAnalyzeResponse
from app.services.ai_analyzer import analyze_build

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/analyze", response_model=AIAnalyzeResponse)
def analyze_pc_build(data: AIAnalyzeRequest):
    result = analyze_build(data.components)
    return result
