from typing import List, Optional
from pydantic import BaseModel, Field

class KrishiIntelligence(BaseModel):
    spray_conditions: str          # Favorable, Unfavorable, Critical
    spray_score: int               # 0-100
    soil_moisture_estimate: str    # Wet, Optimal, Dry
    irrigation_needed: bool
    irrigation_advice: str
    pest_disease_risk: str         # Low, Medium, High
    harvesting_window: str
    storage_warning: Optional[str] = None
    recommended_crops: List[str] = Field(default_factory=list)
    crop_reasoning: Optional[str] = None

class IntelligenceSummary(BaseModel):
    is_personalized: bool = True
    top_recommendations: List[str]
    critical_alerts: List[str]
    krishi: Optional[KrishiIntelligence] = None
