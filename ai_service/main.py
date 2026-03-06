from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import consultation, labs, clinical

app = FastAPI(
    title="AI Medical Assistant - AI Layer",
    description="Python FastAPI service handling Medical Reasoning, Triage, Lab Interpretation, and RAG.",
    version="1.0.0"
)

# Allow CORS since Next.js frontend will call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(consultation.router)
app.include_router(labs.router)
app.include_router(clinical.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ai_service"}
