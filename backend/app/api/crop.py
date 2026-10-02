from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.crop_model.crop_predictor import CropPredictor

router = APIRouter(prefix="/crop", tags=["Crop Prediction"])

# Initialize predictor globally
try:
    predictor = CropPredictor()
    print("Crop model loaded successfully!")
except Exception as e:
    print(f"Failed to load crop model: {e}")
    predictor = None

class CropPredictionRequest(BaseModel):
    Nitrogen: float
    Phosporus: float
    Potassium: float
    Temperature: float
    Humidity: float
    Ph: float
    Rainfall: float

class CropPredictionResponse(BaseModel):
    crop: str
    message: str

@router.post("/predict", response_model=CropPredictionResponse)
async def predict_crop(request: CropPredictionRequest):
    if predictor is None:
        raise HTTPException(status_code=500, detail="Crop prediction model is not loaded")
        
    try:
        recommended_crop = predictor.predict(
            request.Nitrogen, 
            request.Phosporus, 
            request.Potassium, 
            request.Temperature, 
            request.Humidity, 
            request.Ph, 
            request.Rainfall
        )
        return CropPredictionResponse(
            crop=recommended_crop,
            message=f"{recommended_crop} is the best crop to be cultivated right there."
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
