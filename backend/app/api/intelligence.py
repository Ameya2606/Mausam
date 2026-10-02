from pydantic import BaseModel
from fastapi import APIRouter
from ..models.weather import WeatherResponse
from ..models.user_context import UserContext
from ..models.intelligence import IntelligenceSummary
from ..intelligence.scoring import (
    calculate_krishi_intelligence,
)

router = APIRouter(prefix="/intelligence", tags=["VayuSync Intelligence"])

class SummaryRequest(BaseModel):
    weather: WeatherResponse
    context: UserContext


@router.post("/summary", response_model=IntelligenceSummary)
async def get_intelligence_summary(req: SummaryRequest):
    """
    Computes personalized Krishi intelligence.
    """
    w = req.weather
    c = req.context

    krishi = calculate_krishi_intelligence(w)

    top_recs = []
    if w.current.precipitation_probability > 50:
        top_recs.append(f"Precipitation alert ({w.current.precipitation_probability}%). Plan farming activities accordingly.")
    if w.current.aqi > 200:
        top_recs.append(f"High particulate smog (AQI {w.current.aqi}). Wear protection if working outdoors.")
    if not top_recs:
        top_recs.append("Skies are clear and favorable. All scheduled activities can proceed normally.")

    critical_alerts = [a.title for a in w.alerts] if w.alerts else []

    return IntelligenceSummary(
        is_personalized=c.is_personalized,
        top_recommendations=top_recs,
        critical_alerts=critical_alerts,
        krishi=krishi,
    )

