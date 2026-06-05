import joblib
from flask import Flask, request, jsonify

app = Flask(__name__)

model = joblib.load("model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    temperature = data["temperature"]
    runtime = data["runtime"]
    vibration = data["vibration"]
    pressure = data["pressure"]
    humidity = data["humidity"]
    current_value = data["currentValue"]
    voltage = data["voltage"]

    features = [[
        temperature,
        runtime,
        vibration,
        pressure,
        humidity,
        current_value,
        voltage
    ]]

    prediction = model.predict(features)[0]

    probability = float(
        max(model.predict_proba(features)[0])
    )

    # ===================================
    # CAUSE + SOLUTION
    # ===================================

    cause = "Aucune cause détectée"
    solution = "Aucune solution recommandée"

    if temperature > 100:
        cause = "Surchauffe de l'équipement"
        solution = "Vérifier le système de refroidissement"

    elif vibration > 7:
        cause = "Vibration excessive"
        solution = "Contrôler les roulements et l'alignement"

    elif runtime > 2500:
        cause = "Temps de fonctionnement élevé"
        solution = "Planifier une maintenance préventive"

    elif current_value > 45:
        cause = "Surintensité moteur"
        solution = "Inspecter le moteur électrique"

    elif voltage < 360:
        cause = "Tension électrique faible"
        solution = "Vérifier l'alimentation électrique"

    elif pressure > 6:
        cause = "Pression anormale"
        solution = "Contrôler les vannes et les capteurs"

    # ===================================

    return jsonify({
        "prediction": prediction,
        "probability": probability,
        "cause": cause,
        "solution": solution
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )