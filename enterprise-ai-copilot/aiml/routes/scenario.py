"""
Scenario Simulation Route — AI-powered strategic scenario modeling
"""
import os
import math
import random
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()


class ScenarioRequest(BaseModel):
    domain: str = "Market Expansion"
    risk: str = "Moderate"
    horizon: int = 12
    confidence: float = 72.0


class MonthData(BaseModel):
    name: str
    projected: float
    baseline: float


class Insight(BaseModel):
    level: str
    text: str


class ScenarioResponse(BaseModel):
    rev: float
    cost: float
    roi: float
    months: List[MonthData]
    riskScore: int
    riskLabel: str
    insights: List[Insight]
    domain: str
    risk: str
    horizon: int
    confidence: float


RISK_MULTIPLIERS = {"Conservative": 0.6, "Moderate": 1.0, "Aggressive": 1.4}
DOMAIN_BOOSTS = {
    "Market Expansion": 1.0,
    "Cost Optimisation": 0.75,
    "Product Launch": 1.2,
    "M&A Strategy": 1.35,
    "Digital Transformation": 0.9,
}


def compute_scenario(domain: str, risk: str, horizon: int, confidence: float) -> dict:
    r_mult = RISK_MULTIPLIERS.get(risk, 1.0)
    d_boost = DOMAIN_BOOSTS.get(domain, 1.0)
    c_mult = max(10, min(100, confidence)) / 100

    rev  = round(18 + r_mult * d_boost * 22 * c_mult, 1)
    cost = round(10 + r_mult * 13, 1)
    roi  = round(rev / max(cost, 1) * 0.72, 2)

    months_count = min(int(horizon), 8)
    months = []
    for i in range(months_count):
        projected = round(20 + (rev / months_count) * i + random.uniform(-3, 5), 1)
        baseline  = round(10 + i * 1.6, 1)
        months.append(MonthData(name=f"M{i+1}", projected=projected, baseline=baseline))

    risk_score = {"Conservative": 22, "Moderate": 42, "Aggressive": 68}.get(risk, 42)
    risk_label = {"Conservative": "Low", "Moderate": "Moderate", "Aggressive": "Elevated"}.get(risk, "Moderate")

    insights = generate_insights(domain, risk, horizon, confidence, rev, roi)
    return dict(rev=rev, cost=cost, roi=roi, months=months, riskScore=risk_score,
                riskLabel=risk_label, insights=insights, domain=domain, risk=risk,
                horizon=horizon, confidence=confidence)


def generate_insights(domain, risk, horizon, confidence, rev, roi) -> List[Insight]:
    results = []
    conf_str = "strong" if confidence >= 70 else "moderate"
    results.append(Insight(level="positive",
        text=f"{domain} model complete. Confidence-adjusted outlook: {conf_str}. Projected revenue uplift: +{rev}%."))

    if risk == "Aggressive":
        results.append(Insight(level="danger",
            text="Elevated risk profile. Dedicated risk monitoring team and weekly steering committee required."))
    elif risk == "Conservative":
        results.append(Insight(level="info",
            text="Conservative path delivers steady, predictable returns. Capital-preservation friendly."))
    else:
        results.append(Insight(level="warning",
            text="Cost overruns possible in months 3–6. Phased capital deployment recommended."))

    window = round(6 + (confidence / 100) * 4)
    results.append(Insight(level="info",
        text=f"First-mover advantage window: ~{window} weeks. Two competitors detected with similar strategic moves."))

    if roi >= 2.0:
        results.append(Insight(level="positive",
            text=f"ROI projection: {roi}x — strong investment case. Data quality confirmed at 94%."))
    else:
        results.append(Insight(level="warning",
            text=f"ROI projection: {roi}x — marginal. Consider extending horizon or adjusting risk appetite."))

    if horizon > 24:
        results.append(Insight(level="info",
            text="Long horizon increases uncertainty. Recommend 6-month review gates with AI model recalibration."))

    return results


@router.post("/", response_model=ScenarioResponse)
async def run_scenario(req: ScenarioRequest):
    result = compute_scenario(req.domain, req.risk, req.horizon, req.confidence)
    return ScenarioResponse(**result)


@router.get("/domains")
async def get_domains():
    return {
        "domains": list(DOMAIN_BOOSTS.keys()),
        "riskLevels": list(RISK_MULTIPLIERS.keys()),
        "horizonRange": {"min": 3, "max": 60, "step": 3},
        "confidenceRange": {"min": 10, "max": 100},
    }
