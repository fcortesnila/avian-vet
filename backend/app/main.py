import os
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas
from .assistant import answer
from .db import Base, engine, get_db

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Avian Vet API", version="0.1.0")
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST"], allow_headers=["*"])

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/patients", response_model=list[schemas.PatientRead])
def list_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).order_by(models.Patient.id.desc()).limit(100).all()

@app.post("/api/patients", response_model=schemas.PatientRead, status_code=201)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    record = models.Patient(**patient.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@app.post("/api/assistant/ask")
def ask_assistant(payload: dict):
    question = payload.get("question", "")
    if not isinstance(question, str) or len(question) > 1200:
        raise HTTPException(status_code=422, detail="question must be text up to 1200 characters")
    return answer(question)
