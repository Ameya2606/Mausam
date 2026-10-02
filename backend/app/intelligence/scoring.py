from typing import List
from ..models.weather import WeatherResponse
from ..models.intelligence import KrishiIntelligence

def calculate_krishi_intelligence(weather: WeatherResponse) -> KrishiIntelligence:
    curr = weather.current
    if curr.wind_speed < 15 and curr.precipitation_probability < 30:
        spray_status = "Optimal Window"
        spray_score = 92
    elif curr.wind_speed >= 25 or curr.precipitation_probability >= 60:
        spray_status = "Unfavorable / Suspended"
        spray_score = 15
    else:
        spray_status = "Moderate / Short Window"
        spray_score = 55

    if curr.precipitation > 10 or curr.precipitation_probability > 70:
        soil_moisture = "High / Saturated"
        irrigation_needed = False
        irr_adv = "Postpone canal irrigation; natural rainfall will adequately charge root zones."
    elif curr.temperature > 35 and curr.humidity < 35:
        soil_moisture = "Dry / Moisture Deficit"
        irrigation_needed = True
        irr_adv = "Execute light evening drip or furrow irrigation."
    else:
        soil_moisture = "Adequate"
        irrigation_needed = False
        irr_adv = "Soil moisture within healthy range."

    pest_risk = "High" if curr.humidity > 80 and curr.temperature > 25 else "Low to Moderate"

    # Crop Recommendations Engine
    recommended_crops = []
    crop_reasoning = ""
    
    if curr.precipitation_probability > 60 and curr.temperature > 25:
        recommended_crops = ["Rice (Paddy)", "Sugarcane", "Cotton"]
        crop_reasoning = "High moisture and warm temperatures are optimal for water-intensive monsoon crops."
    elif curr.temperature > 35 and curr.precipitation_probability < 30:
        recommended_crops = ["Bajra (Pearl Millet)", "Jowar (Sorghum)", "Maize (Corn)"]
        crop_reasoning = "Dry and hot conditions require drought-resistant, hardy crops."
    elif 15 <= curr.temperature <= 25 and curr.precipitation_probability > 30:
        recommended_crops = ["Wheat", "Mustard & Rapeseed (Sarson)", "Gram (Chickpea / Chana)"]
        crop_reasoning = "Cooler temperatures with moderate moisture support winter and rabi crops."
    elif curr.humidity > 70 and 20 <= curr.temperature <= 30:
        recommended_crops = ["Tomato", "Moong (Green Gram)", "Field Pea (Matar)"]
        crop_reasoning = "Moderate warmth and high humidity favor horticultural and legume growth."
    else:
        recommended_crops = ["Onion", "Potato", "Masur (Lentil)"]
        crop_reasoning = "Stable, moderate conditions are versatile for a variety of staple crops."

    return KrishiIntelligence(
        spray_conditions=spray_status,
        spray_score=spray_score,
        soil_moisture_estimate=soil_moisture,
        irrigation_needed=irrigation_needed,
        irrigation_advice=irr_adv,
        pest_disease_risk=pest_risk,
        harvesting_window="Delay harvesting if rain probability exceeds 50% to prevent grain spoilage.",
        storage_warning="Ensure harvested grain sacks are elevated on wooden pallets." if curr.humidity > 75 else None,
        recommended_crops=recommended_crops,
        crop_reasoning=crop_reasoning,
    )
