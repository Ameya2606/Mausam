from typing import List, Optional
from pydantic import BaseModel, Field

class UserContext(BaseModel):
    name: str = "Ameya"
    is_personalized: bool = False
    
    # Flexible Multi-Select Interests
    interests: List[str] = Field(default_factory=list)
    
    # Flexible Multi-Select Priorities (Weightings)
    priorities: List[str] = Field(default_factory=list)

    # Environmental Sensitivities
    sensitivities: List[str] = Field(default_factory=list)
    
    # Role-Specific Preferences & Telemetry Details
    role_details: Optional[dict] = None
