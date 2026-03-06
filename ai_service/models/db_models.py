from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, default="patient") # patient, doctor, admin
    email = Column(String, unique=True, index=True)
    name = Column(String)

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    specialty = Column(String)
    bio = Column(Text)
    price_per_consultation = Column(Integer)

class Consultation(Base):
    __tablename__ = "consultations"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True) # Initially null during AI triage
    status = Column(String, default="triage_in_progress") # triage_completed, booked, completed
    risk_level = Column(String, nullable=True)

class Anamnesis(Base):
    __tablename__ = "anamnesis"
    
    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultations.id"))
    symptoms = Column(JSON) # e.g. ["cough", "fever"]
    data = Column(JSON) # e.g. {"age": 30, "duration": "2 days"}

class LabReport(Base):
    __tablename__ = "lab_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    extracted_data = Column(JSON)
    ai_interpretation = Column(Text)

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    consultation_id = Column(Integer, ForeignKey("consultations.id"))
    schedule_time = Column(String) # Simple string for MVP
    meeting_link = Column(String, nullable=True) # WebRTC/LiveKit room URL

class MedicalDocument(Base):
    __tablename__ = "medical_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    source = Column(String)
    # The Vector column type provided by pgvector. 1536 is standard for OpenAI ada-002 embeddings.
    embedding = Column(Vector(1536))
