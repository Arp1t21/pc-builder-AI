from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class AIAnalyzeRequest(BaseModel):
    components: Dict[str, Any]


class AIAnalyzeResponse(BaseModel):
    score: float
    overallAssessment: str
    balance: str
    recommendations: List[str]
    warnings: List[str]
    useCases: str
