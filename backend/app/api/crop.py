from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
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
from pydantic import BaseModel, Field

class CropPredictionRequest(BaseModel):
    Nitrogen: float = Field(ge=0, le=140, description="Nitrogen content in kg/ha")
    Phosporus: float = Field(ge=5, le=145, description="Phosphorus content in kg/ha")
    Potassium: float = Field(ge=5, le=205, description="Potassium content in kg/ha")
    Temperature: float = Field(ge=5, le=50, description="Temperature in °C")
    Humidity: float = Field(ge=10, le=100, description="Relative humidity in %")
    Ph: float = Field(ge=3, le=10, description="pH value")
    Rainfall: float = Field(ge=20, le=300, description="Rainfall in mm")

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
