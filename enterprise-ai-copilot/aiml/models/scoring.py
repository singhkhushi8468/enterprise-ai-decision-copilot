"""
Model Scoring Utilities — decision confidence scoring and explainability helpers
"""
import math
import random
from typing import List, Dict, Any, Tuple


def score_decision(
    scenario_params: Dict[str, Any],
    historical_accuracy: float = 0.84,
) -> Dict[str, Any]:
    """
    Score a strategic decision's confidence level.
    Returns overall confidence and factor breakdown.
    """
    risk       = scenario_params.get("risk", "Moderate")
    confidence = float(scenario_params.get("confidence", 72))
    horizon    = int(scenario_params.get("horizon", 12))
    domain     = scenario_params.get("domain", "Market Expansion")

    # Factor weights
    data_quality_score   = confidence / 100
    risk_penalty         = {"Conservative": 0.95, "Moderate": 0.85, "Aggressive": 0.70}.get(risk, 0.85)
    horizon_decay        = max(0.5, 1.0 - (horizon / 60) * 0.4)
    domain_familiarity   = {"Market Expansion": 0.9, "Cost Optimisation": 0.85,
                            "Product Launch": 0.8, "M&A Strategy": 0.75,
                            "Digital Transformation": 0.82}.get(domain, 0.8)

    overall = (
        data_quality_score * 0.30 +
        risk_penalty       * 0.25 +
        horizon_decay      * 0.20 +
        domain_familiarity * 0.15 +
        historical_accuracy * 0.10
    )
    overall = round(min(0.99, max(0.10, overall)) * 100, 1)

    return {
        "overall_confidence": overall,
        "grade": "A" if overall >= 80 else "B" if overall >= 65 else "C" if overall >= 50 else "D",
        "factors": {
            "data_quality":        round(data_quality_score  * 100, 1),
            "risk_adjustment":     round(risk_penalty         * 100, 1),
            "horizon_reliability": round(horizon_decay        * 100, 1),
            "domain_familiarity":  round(domain_familiarity   * 100, 1),
            "historical_accuracy": round(historical_accuracy  * 100, 1),
        },
        "recommendation": _get_recommendation(overall, risk),
    }


def _get_recommendation(confidence: float, risk: str) -> str:
    if confidence >= 80:
        return "High confidence. Recommend proceeding with full execution plan."
    elif confidence >= 65:
        if risk == "Aggressive":
            return "Moderate confidence with high risk. Consider reducing scope or increasing data collection."
        return "Moderate confidence. Proceed with phased approach and 30-day review gates."
    elif confidence >= 50:
        return "Low-moderate confidence. Recommend additional data gathering before committing capital."
    else:
        return "Low confidence. Do not proceed without significant additional validation."


def explain_prediction(
    feature_values: Dict[str, float],
    feature_weights: Dict[str, float],
    prediction: float,
) -> List[Dict[str, Any]]:
    """
    SHAP-style feature contribution explanation.
    Returns sorted list of feature contributions to the prediction.
    """
    baseline    = prediction * 0.5
    total_weight = sum(abs(w) for w in feature_weights.values()) or 1.0
    contributions = []

    for feature, value in feature_values.items():
        weight     = feature_weights.get(feature, 0.0)
        contrib    = (weight / total_weight) * (prediction - baseline)
        direction  = "positive" if contrib > 0 else "negative" if contrib < 0 else "neutral"
        contributions.append({
            "feature":       feature,
            "value":         round(value, 3),
            "contribution":  round(contrib, 3),
            "direction":     direction,
            "importance_pct": round(abs(weight / total_weight) * 100, 1),
        })

    contributions.sort(key=lambda x: -abs(x["contribution"]))
    return contributions


def detect_data_drift(
    reference_stats: Dict[str, float],
    current_stats: Dict[str, float],
    threshold: float = 0.15,
) -> Dict[str, Any]:
    """
    Detect data drift between reference and current distributions.
    Returns drift flags for model retraining decisions.
    """
    drift_detected = False
    feature_drift  = {}

    for feature in reference_stats:
        if feature not in current_stats:
            continue
        ref = reference_stats[feature]
        cur = current_stats[feature]
        if ref == 0:
            pct_change = 0.0
        else:
            pct_change = abs((cur - ref) / ref)

        drifted = pct_change > threshold
        if drifted:
            drift_detected = True
        feature_drift[feature] = {
            "reference":    round(ref, 3),
            "current":      round(cur, 3),
            "pct_change":   round(pct_change * 100, 1),
            "drifted":      drifted,
        }

    return {
        "drift_detected":      drift_detected,
        "features_drifted":    sum(1 for v in feature_drift.values() if v["drifted"]),
        "total_features":      len(feature_drift),
        "feature_drift":       feature_drift,
        "recommendation":      "Retrain model — significant data drift detected." if drift_detected else "No retraining required.",
    }
