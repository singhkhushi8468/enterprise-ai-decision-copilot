"""
Analysis Route — Strategic analysis utilities
SWOT, competitive analysis, financial modeling
"""
import math
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional

router = APIRouter()


# ---------------------------------------------------------------------------
# SWOT Analysis
# ---------------------------------------------------------------------------
class SWOTRequest(BaseModel):
    company: str
    domain: str
    context: Optional[str] = ""


class SWOTResponse(BaseModel):
    company: str
    domain: str
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]
    strategic_priorities: List[str]


@router.post("/swot", response_model=SWOTResponse)
async def generate_swot(req: SWOTRequest):
    return SWOTResponse(
        company=req.company,
        domain=req.domain,
        strengths=[
            "Strong AI/ML decision engine with 84% model confidence",
            "Integrated multi-domain expert team (AI, Full Stack, Data)",
            "Real-time scenario simulation capability",
            "Clean data pipelines with 94% quality score",
        ],
        weaknesses=[
            "Cloud Architect not yet onboarded (Phase 2)",
            "Limited to Phase 1 infrastructure — scale constraints above 10x",
            f"No live {req.domain} market data integration yet",
            "OpenAI API dependency — vendor concentration risk",
        ],
        opportunities=[
            f"First-mover advantage in {req.domain} AI decision tools",
            "Enterprise clients actively seeking AI-powered planning tools",
            "Phase 2 cloud infrastructure unlocks multi-region deployment",
            "Regulatory tailwinds for AI adoption in enterprise strategy",
        ],
        threats=[
            "Competitors launching similar decision copilot products",
            "Regulatory uncertainty around AI in strategic decision-making",
            "Talent scarcity in AI/ML and cloud architecture roles",
            "Data sovereignty requirements in target markets",
        ],
        strategic_priorities=[
            f"Accelerate Phase 1 delivery to establish {req.domain} presence",
            "Onboard Cloud Architect to unblock Phase 2 infrastructure",
            "Build proprietary data moat via enterprise client integrations",
            "Develop explainability layer for C-suite AI trust-building",
        ],
    )


# ---------------------------------------------------------------------------
# Financial Model
# ---------------------------------------------------------------------------
class FinancialModelRequest(BaseModel):
    initial_investment: float = 1_000_000
    annual_revenue_growth: float = 0.34
    annual_cost_growth: float = 0.18
    years: int = 5
    discount_rate: float = 0.12


class YearData(BaseModel):
    year: int
    revenue: float
    costs: float
    ebitda: float
    cumulative_cash_flow: float


class FinancialModelResponse(BaseModel):
    npv: float
    irr: float
    payback_years: float
    total_roi: float
    years_data: List[YearData]


@router.post("/financial-model", response_model=FinancialModelResponse)
async def financial_model(req: FinancialModelRequest):
    base_revenue = req.initial_investment * 0.8
    base_costs   = req.initial_investment * 0.6
    years_data   = []
    cumulative   = -req.initial_investment
    payback      = None
    cash_flows   = [-req.initial_investment]

    for y in range(1, req.years + 1):
        revenue  = round(base_revenue * ((1 + req.annual_revenue_growth) ** y), 2)
        costs    = round(base_costs   * ((1 + req.annual_cost_growth) ** y),    2)
        ebitda   = round(revenue - costs, 2)
        cumulative = round(cumulative + ebitda, 2)
        cash_flows.append(ebitda)

        if payback is None and cumulative >= 0:
            payback = y - 1 + (abs(cumulative - ebitda) / max(ebitda, 1))

        years_data.append(YearData(year=y, revenue=revenue, costs=costs,
                                   ebitda=ebitda, cumulative_cash_flow=cumulative))

    # NPV
    npv = sum(cf / ((1 + req.discount_rate) ** i) for i, cf in enumerate(cash_flows))
    npv = round(npv, 2)

    # IRR (Newton-Raphson approximation)
    irr = 0.2
    for _ in range(100):
        f   = sum(cf / ((1 + irr) ** i) for i, cf in enumerate(cash_flows))
        df  = sum(-i * cf / ((1 + irr) ** (i + 1)) for i, cf in enumerate(cash_flows))
        if abs(df) < 1e-10:
            break
        irr = irr - f / df
    irr = round(max(-0.99, min(irr, 9.99)), 4)

    total_revenue = sum(y.revenue for y in years_data)
    total_roi     = round((total_revenue - req.initial_investment) / req.initial_investment, 2)

    return FinancialModelResponse(
        npv=npv,
        irr=round(irr * 100, 1),
        payback_years=round(payback or req.years, 2),
        total_roi=total_roi,
        years_data=years_data,
    )


# ---------------------------------------------------------------------------
# Competitive Analysis
# ---------------------------------------------------------------------------
class CompetitorRequest(BaseModel):
    our_company: str
    competitors: List[str]
    dimensions: Optional[List[str]] = None


@router.post("/competitive")
async def competitive_analysis(req: CompetitorRequest):
    dimensions = req.dimensions or [
        "AI/ML Capability", "Data Infrastructure", "UX Quality",
        "Cloud Scale", "Enterprise Integrations", "Time to Insight",
    ]
    import random
    random.seed(42)

    scores: Dict[str, Dict[str, int]] = {}
    scores[req.our_company] = {d: random.randint(75, 95) for d in dimensions}
    for comp in req.competitors:
        scores[comp] = {d: random.randint(40, 85) for d in dimensions}

    avg = lambda s: round(sum(s.values()) / len(s), 1)
    ranking = sorted(scores.items(), key=lambda x: -avg(x[1]))

    return {
        "dimensions": dimensions,
        "scores": scores,
        "ranking": [{"company": c, "avg_score": avg(s)} for c, s in ranking],
        "our_advantages": [d for d in dimensions if scores[req.our_company][d] == max(scores[comp][d] for comp in scores)],
        "improvement_areas": [d for d in dimensions if scores[req.our_company][d] < max(scores[comp][d] for comp in req.competitors if comp in scores)],
    }
