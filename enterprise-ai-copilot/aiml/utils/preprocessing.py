"""
Data Pipeline Utilities — preprocessing for AI model inputs
"""
import math
import statistics
from typing import List, Dict, Any, Optional


def normalize(values: List[float], method: str = "minmax") -> List[float]:
    """Normalize a list of values."""
    if not values:
        return []
    if method == "minmax":
        lo, hi = min(values), max(values)
        rng = hi - lo
        if rng == 0:
            return [0.5] * len(values)
        return [round((v - lo) / rng, 4) for v in values]
    elif method == "zscore":
        mean = statistics.mean(values)
        std  = statistics.stdev(values) if len(values) > 1 else 1.0
        return [round((v - mean) / max(std, 1e-9), 4) for v in values]
    return values


def validate_scenario_inputs(domain: str, risk: str, horizon: int, confidence: float) -> Dict[str, Any]:
    """Validate and sanitize scenario simulation inputs."""
    errors = []
    valid_domains = ["Market Expansion", "Cost Optimisation", "Product Launch", "M&A Strategy", "Digital Transformation"]
    valid_risks   = ["Conservative", "Moderate", "Aggressive"]

    if domain not in valid_domains:
        errors.append(f"Invalid domain. Must be one of: {valid_domains}")
    if risk not in valid_risks:
        errors.append(f"Invalid risk level. Must be one of: {valid_risks}")
    if not (3 <= horizon <= 60):
        errors.append("Horizon must be between 3 and 60 months")
    if not (10.0 <= confidence <= 100.0):
        errors.append("Confidence must be between 10 and 100")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "sanitized": {
            "domain":     domain if domain in valid_domains else valid_domains[0],
            "risk":       risk   if risk   in valid_risks   else "Moderate",
            "horizon":    max(3, min(60, int(horizon))),
            "confidence": max(10.0, min(100.0, float(confidence))),
        },
    }


def calculate_confidence_interval(value: float, confidence: float, n: int = 30) -> Dict[str, float]:
    """Calculate confidence interval around a projected value."""
    import math
    z = 1.96  # 95% CI
    std_err = (1 - confidence / 100) * abs(value) * 0.3
    margin  = z * std_err / math.sqrt(max(n, 1))
    return {
        "estimate": round(value, 2),
        "lower":    round(value - margin, 2),
        "upper":    round(value + margin, 2),
        "margin":   round(margin, 2),
    }


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Split text into overlapping chunks for RAG ingestion."""
    words  = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


def compute_risk_matrix(risks: List[Dict]) -> Dict[str, Any]:
    """
    Compute risk matrix summary.
    Each risk: { name, probability (0-1), impact (0-1), category }
    """
    for r in risks:
        r["score"]    = round(r.get("probability", 0.5) * r.get("impact", 0.5) * 100, 1)
        r["level"]    = "High" if r["score"] > 50 else "Medium" if r["score"] > 25 else "Low"

    total_score = sum(r["score"] for r in risks) / max(len(risks), 1)
    high_count  = sum(1 for r in risks if r["level"] == "High")
    med_count   = sum(1 for r in risks if r["level"] == "Medium")

    return {
        "risks":         risks,
        "overall_score": round(total_score, 1),
        "overall_level": "High" if total_score > 50 else "Medium" if total_score > 25 else "Low",
        "high_count":    high_count,
        "medium_count":  med_count,
        "low_count":     len(risks) - high_count - med_count,
    }
