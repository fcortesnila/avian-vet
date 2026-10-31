from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class PatientCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    species: str = Field(min_length=1, max_length=80)
    owner_name: str = Field(min_length=1, max_length=120)
    notes: str = Field(default="", max_length=4000)

class PatientRead(PatientCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
