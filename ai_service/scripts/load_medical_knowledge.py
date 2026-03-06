import asyncio
import json
import os
import sys

# Add parent path to import from ai_service root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import engine, Base, async_session_maker
from models.db_models import MedicalDocument
from services.rag_engine import MedicalRAGEngine

# Mock Medical Knowledge Data
MOCK_KNOWLEDGE = [
    {
        "title": "WHO Guidelines: Acute Coronary Syndrome",
        "content": "Patients presenting with severe chest pain, shortness of breath, and diaphoresis (sweating) should be evaluated immediately for Acute Coronary Syndrome (ACS) including Myocardial Infarction. Immediate ECG and Troponin tests are required.",
        "source": "WHO Clinical Protocols"
    },
    {
        "title": "ICD-10: Upper Respiratory Tract Infection",
        "content": "Common viral upper respiratory infections present with cough, mild fever, fatigue, and nasal congestion. Usually self-limiting. Treatment is primarily symptomatic.",
        "source": "ICD-10 Guidelines"
    },
    {
        "title": "Iron Deficiency Anemia Management",
        "content": "Low hemoglobin levels, especially in patients with fatigue, suggest anemia. Iron deficiency anemia is confirmed via low ferritin. Recommended follow-up: Iron panel and Reticulocyte count.",
        "source": "Clinical Hematology Textbook"
    }
]

async def init_db_and_load():
    print("1. Creating database tables if they don't exist...")
    # NOTE: You must manually ensure the Postgres database has the 'vector' extension enabled!
    # CREATE EXTENSION IF NOT EXISTS vector;
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    print("2. Initializing RAG Engine dummy embedder...")
    rag = MedicalRAGEngine()
    
    print("3. Ingesting Medical Knowledge into PgVector...")
    async with async_session_maker() as session:
        for doc in MOCK_KNOWLEDGE:
            # Generate Embedding
            embedding = await rag.get_embedding(doc["content"])
            
            # Create Database Record
            record = MedicalDocument(
                title=doc["title"],
                content=doc["content"],
                source=doc["source"],
                embedding=embedding
            )
            session.add(record)
            
        await session.commit()
        print("Done! Knowledge base loaded.")

if __name__ == "__main__":
    asyncio.run(init_db_and_load())
