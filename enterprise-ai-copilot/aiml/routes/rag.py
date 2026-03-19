"""
RAG Pipeline Route — Retrieval Augmented Generation for enterprise knowledge base
Uses ChromaDB as vector store + OpenAI embeddings
"""
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# ---------------------------------------------------------------------------
# Sample enterprise knowledge base documents
# In production: load from your actual enterprise data sources
# ---------------------------------------------------------------------------
KNOWLEDGE_BASE = [
    {
        "id": "kb001",
        "title": "Market Expansion Framework",
        "content": "Enterprise market expansion requires a 3-phase approach: (1) Market Assessment — TAM/SAM/SOM analysis, competitive mapping, regulatory scan. (2) Entry Strategy — MVP launch, partnership identification, pricing model. (3) Scale — distribution expansion, localisation, performance optimization. Key metrics: CAC, LTV, market penetration rate, NPS.",
        "tags": ["market", "expansion", "strategy"],
    },
    {
        "id": "kb002",
        "title": "Cost Optimisation Playbook",
        "content": "Cost reduction levers ranked by impact: (1) Cloud right-sizing — 20-40% infra savings via reserved instances and auto-scaling. (2) Vendor consolidation — 15-25% savings through negotiated enterprise agreements. (3) Process automation — 30-50% labour cost reduction in repetitive workflows. (4) Data pipeline optimisation — reduce compute costs via columnar storage and query optimisation.",
        "tags": ["cost", "optimisation", "cloud", "efficiency"],
    },
    {
        "id": "kb003",
        "title": "Risk Assessment Matrix",
        "content": "Enterprise risk categories: Market Risk (demand volatility, competitor moves), Operational Risk (execution gaps, talent shortages), Financial Risk (FX exposure, credit risk, liquidity), Regulatory Risk (compliance changes, data sovereignty, licensing). Risk scoring: Probability x Impact. Mitigation strategies: transfer, avoid, reduce, accept.",
        "tags": ["risk", "assessment", "compliance", "mitigation"],
    },
    {
        "id": "kb004",
        "title": "AI/ML Model Deployment Best Practices",
        "content": "Production AI deployment checklist: (1) Model validation — holdout test, A/B test, shadow mode. (2) Monitoring — data drift detection, prediction confidence tracking, latency SLAs. (3) Feedback loops — human-in-the-loop for low-confidence predictions. (4) Versioning — MLflow or DVC for experiment tracking. (5) Explainability — SHAP or LIME for XAI outputs to stakeholders.",
        "tags": ["ai", "ml", "deployment", "mlops", "monitoring"],
    },
    {
        "id": "kb005",
        "title": "Cloud Architecture Patterns (Phase 2)",
        "content": "Recommended cloud patterns for the Enterprise AI Copilot: Multi-region active-active for 99.99% uptime. Event-driven architecture with Kafka for real-time data. Kubernetes HPA for auto-scaling AI workloads. Zero-trust IAM with least-privilege. Cost governance via FinOps practices — tagging, budgets, anomaly detection. CI/CD via GitOps with ArgoCD.",
        "tags": ["cloud", "architecture", "kubernetes", "infrastructure", "phase2"],
    },
    {
        "id": "kb006",
        "title": "Data Engineering Pipeline Standards",
        "content": "Enterprise data pipeline standards: (1) Ingestion — Kafka for streaming, Fivetran for SaaS connectors, custom Python for REST APIs. (2) Storage — raw zone (S3/GCS), curated zone (Delta Lake), serving zone (Snowflake). (3) Transformation — dbt for SQL transforms, Spark for large-scale processing. (4) Quality — Great Expectations for data contracts. (5) Orchestration — Apache Airflow with SLA monitoring.",
        "tags": ["data", "pipeline", "kafka", "snowflake", "airflow"],
    },
]


class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 3
    tags: Optional[List[str]] = None


class RAGDocument(BaseModel):
    id: str
    title: str
    content: str
    tags: List[str]
    relevance_score: float


class RAGResponse(BaseModel):
    query: str
    documents: List[RAGDocument]
    answer: Optional[str] = None
    mode: str


class IngestRequest(BaseModel):
    title: str
    content: str
    tags: List[str] = []


def simple_keyword_search(query: str, docs: list, top_k: int = 3) -> list:
    """Fallback keyword search when ChromaDB/OpenAI is not available."""
    query_words = set(query.lower().split())
    scored = []
    for doc in docs:
        text = (doc["title"] + " " + doc["content"] + " " + " ".join(doc["tags"])).lower()
        score = sum(1 for w in query_words if w in text) / max(len(query_words), 1)
        scored.append((score, doc))
    scored.sort(key=lambda x: -x[0])
    return [(doc, score) for score, doc in scored[:top_k]]


@router.post("/query", response_model=RAGResponse)
async def query_rag(req: RAGQueryRequest):
    api_key = os.getenv("OPENAI_API_KEY", "")

    # Filter by tags if provided
    docs = KNOWLEDGE_BASE
    if req.tags:
        docs = [d for d in docs if any(t in d["tags"] for t in req.tags)]

    # Try ChromaDB + OpenAI embeddings; fall back to keyword search
    retrieved = []
    mode = "keyword"

    if api_key and api_key != "your_openai_api_key_here":
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)

            # Use OpenAI embeddings with in-memory similarity (no ChromaDB needed)
            q_emb_resp = client.embeddings.create(model="text-embedding-3-small", input=[req.query])
            q_vec = q_emb_resp.data[0].embedding

            doc_emb_resp = client.embeddings.create(
                model="text-embedding-3-small",
                input=[d["content"] for d in docs],
            )

            def cosine_sim(a, b):
                dot = sum(x * y for x, y in zip(a, b))
                na  = sum(x * x for x in a) ** 0.5
                nb  = sum(x * x for x in b) ** 0.5
                return dot / (na * nb) if na and nb else 0.0

            scored = []
            for i, d in enumerate(docs):
                score = cosine_sim(q_vec, doc_emb_resp.data[i].embedding)
                scored.append((score, d))
            scored.sort(key=lambda x: -x[0])
            retrieved = [(d, round(s, 3)) for s, d in scored[:req.top_k]]
            mode = "semantic"
        except Exception as e:
            print(f"OpenAI embedding error, falling back to keyword: {e}")
            retrieved = simple_keyword_search(req.query, docs, req.top_k)
    else:
        retrieved = simple_keyword_search(req.query, docs, req.top_k)

    rag_docs = [
        RAGDocument(id=d["id"], title=d["title"], content=d["content"],
                    tags=d["tags"], relevance_score=score)
        for d, score in retrieved
    ]

    # Generate answer if OpenAI available
    answer = None
    if api_key and api_key != "your_openai_api_key_here" and retrieved:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            context = "\n\n".join([f"[{d['title']}]\n{d['content']}" for d, _ in retrieved])
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "Answer the enterprise strategy question using only the provided context. Be concise and actionable."},
                    {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {req.query}"},
                ],
                max_tokens=400,
            )
            answer = resp.choices[0].message.content
        except Exception as e:
            print(f"Answer generation error: {e}")

    return RAGResponse(query=req.query, documents=rag_docs, answer=answer, mode=mode)


@router.get("/documents")
async def list_documents():
    return {"documents": KNOWLEDGE_BASE, "count": len(KNOWLEDGE_BASE)}


@router.post("/ingest")
async def ingest_document(req: IngestRequest):
    new_doc = {
        "id": f"kb{len(KNOWLEDGE_BASE) + 1:03d}",
        "title": req.title,
        "content": req.content,
        "tags": req.tags,
    }
    KNOWLEDGE_BASE.append(new_doc)
    return {"message": "Document ingested successfully", "id": new_doc["id"]}
