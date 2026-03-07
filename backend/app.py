from flask import Flask, request, jsonify
from flask_cors import CORS

from ai_engine import generate_strategy
from risk_model import calculate_risk

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "AI Decision Backend Running"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    revenue = float(data.get("revenue"))
    budget = float(data.get("budget"))
    goal = data.get("goal")

    strategies = generate_strategy(revenue, budget, goal)
    risk = calculate_risk(revenue, budget)

    profit = revenue - budget

    score = 90
    if risk == "High Risk":
        score = 40
    elif risk == "Medium Risk":
        score = 65

    return jsonify({
        "profit": profit,
        "risk": risk,
        "strategies": strategies,
        "score": score
    })


if __name__ == "__main__":
    app.run(debug=True)