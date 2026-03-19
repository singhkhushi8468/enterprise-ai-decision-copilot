"""
AI/ML Chat Route — LangChain + OpenAI powered strategic decision support
"""
import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

SYSTEM_PROMPT = """You are an Enterprise AI Decision Copilot specializing in strategic planning.
You help C-suite executives with data-driven strategic decisions.

Your expertise covers:
- Market expansion analysis and entry strategy
- Financial scenario modeling (ROI, NPV, risk-adjusted returns)
- Competitive intelligence and positioning
- Operational cost optimization
- Risk assessment and mitigation frameworks
- M&A evaluation and due diligence

Domain expert team:
- AI/ML Expert: decision models, NLP, RAG (Active - Phase 1)
- Full Stack Developer: dashboards, APIs (Active - Phase 1)
- Data Engineer: pipelines, Snowflake, Kafka (Active - Phase 1)
- Cloud Architect: AWS/GCP, Kubernetes (Planned - Phase 2)

Always provide: data-backed insights, specific percentages/numbers, actionable next steps.
Current project: Phase 1 complete, Phase 2 (Cloud) upcoming."""


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []


class ChatResponse(BaseModel):
    reply: str
    mode: str
    tokens_used: Optional[int] = None


DEMO_RESPONSES = [
    "Strategic analysis complete. Based on enterprise scenario modeling, a phased market entry strategy yields 34% revenue uplift over 12 months. Data pipeline quality: 94% (confirmed by Data Engineer). Recommendation: proceed with Phase 1 execution while planning Cloud infrastructure for scale.",
    "Risk assessment complete. Moderate risk profile (42/100). Two critical risks identified: EU regulatory compliance (HIGH) and pre-Phase 2 cloud dependency (MEDIUM). Mitigation plans: legal review by M3, redundant infrastructure ready. ROI remains positive at 2.4x.",
    "Competitive intelligence processed. First-mover advantage window: 6-8 weeks. Two competitors detected with similar strategic moves. Recommended action: accelerate go-to-market in primary market while maintaining quality gates. Full Stack team can deploy monitoring dashboards within 48 hours.",
    "Cost optimisation analysis: $2.4M annualised savings identified. Infrastructure right-sizing (Phase 2 Cloud): 38% reduction. Data pipeline consolidation: 18% compute savings. Three vendor contracts flagged for renegotiation in Q2. Payback period: 6 months.",
]
_demo_idx = [0]


@router.post("/", response_model=ChatResponse)
async def chat(req: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY", "")

    if not api_key or api_key == "your_openai_api_key_here":
        # Demo mode
        reply = DEMO_RESPONSES[_demo_idx[0] % len(DEMO_RESPONSES)]
        _demo_idx[0] += 1
        return ChatResponse(reply=reply + "\n\n*Demo mode — add OPENAI_API_KEY to aiml/.env for live AI*", mode="demo")

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        for h in (req.history or [])[-8:]:
            messages.append({"role": h.role, "content": h.content})
        messages.append({"role": "user", "content": req.message})

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=700,
            temperature=0.7,
        )
        reply = response.choices[0].message.content
        tokens = response.usage.total_tokens
        return ChatResponse(reply=reply, mode="live", tokens_used=tokens)

    except Exception as e:
        reply = DEMO_RESPONSES[_demo_idx[0] % len(DEMO_RESPONSES)]
        _demo_idx[0] += 1
        return ChatResponse(reply=reply + f"\n\n*Fallback mode (OpenAI error: {str(e)[:60]})*", mode="fallback")
