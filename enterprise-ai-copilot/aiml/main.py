"""
Enterprise AI Decision Copilot — AI/ML Service
FastAPI server exposing AI endpoints for decision support, scenario analysis, and RAG.
"""
import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

load_dotenv()

from routes.chat      import router as chat_router
from routes.scenario  import router as scenario_router
from routes.rag       import router as rag_router
from routes.analysis  import router as analysis_router

app = FastAPI(
    title="Enterprise AI Decision Copilot — AI/ML Service",
    description="Strategic planning AI: scenario simulation, decision support, RAG pipeline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router,     prefix="/chat",     tags=["Chat"])
app.include_router(scenario_router, prefix="/scenario", tags=["Scenario"])
app.include_router(rag_router,      prefix="/rag",      tags=["RAG"])
app.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ai-ml",
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
    }


@app.get("/")
def root():
    return {"message": "AI/ML Service running. Visit /docs for API documentation."}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
