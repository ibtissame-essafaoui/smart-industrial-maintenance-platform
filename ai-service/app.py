import joblib
from flask import Flask, request, jsonify

app = Flask(__name__)

model = joblib.load("model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    temperature = float(data["temperature"])
    runtime = float(data["runtime"])
    vibration = float(data["vibration"])
    pressure = float(data["pressure"])
    humidity = float(data["humidity"])
    current_value = float(data["currentValue"])
    voltage = float(data["voltage"])

    features = [[
        temperature,
        runtime,
        vibration,
        pressure,
        humidity,
        current_value,
        voltage
    ]]

    # =====================================
    # IA Prediction
    # =====================================

    prediction = str(
        model.predict(features)[0]
    ).upper()

    probability = float(
        max(
            model.predict_proba(features)[0]
        )
    )

    # =====================================
    # Default values
    # =====================================

    cause = "Aucune anomalie détectée"
    solution = "Aucune intervention requise"

    # =====================================
    # RISQUE
    # =====================================

    if prediction == "RISQUE":

        if temperature > 100:
            cause = "Température élevée"
            solution = "Contrôler le système de refroidissement"

        elif vibration > 7:
            cause = "Vibrations anormales"
            solution = "Vérifier les roulements et l’alignement mécanique"

        elif runtime > 2500:
            cause = "Usure progressive des composants"
            solution = "Planifier une maintenance préventive"

        elif current_value > 45:
            cause = "Surconsommation électrique"
            solution = "Inspecter le moteur et les connexions électriques"

        elif voltage < 360:
            cause = "Instabilité de l’alimentation électrique"
            solution = "Vérifier les câbles et l’alimentation"

        elif pressure > 6:
            cause = "Pression de fonctionnement anormale"
            solution = "Contrôler les vannes et les capteurs"

        elif humidity > 85:
            cause = "Humidité excessive"
            solution = "Vérifier la ventilation et l’étanchéité"

        else:
            cause = "Comportement inhabituel détecté"
            solution = "Inspection préventive recommandée"

    # =====================================
    # PANNE
    # =====================================

    elif prediction == "PANNE":

        if temperature > 110:
            cause = "Surchauffe critique"
            solution = "Arrêter immédiatement l’équipement"

        elif vibration > 9:
            cause = "Défaillance mécanique probable"
            solution = "Remplacer les roulements et réaligner l’arbre"

        elif runtime > 4000:
            cause = "Fin de vie probable des composants"
            solution = "Remplacer les composants critiques"

        elif current_value > 50:
            cause = "Surcharge électrique"
            solution = "Inspecter le moteur et le câblage"

        elif voltage < 340:
            cause = "Chute critique de tension"
            solution = "Contrôler l’alimentation et les protections"

        elif pressure > 8:
            cause = "Surpression critique"
            solution = "Vérifier immédiatement les soupapes"

        elif humidity > 95:
            cause = "Humidité critique"
            solution = "Arrêter l’équipement et vérifier les circuits"

        else:
            cause = "Défaillance critique détectée par l’IA"
            solution = "Maintenance corrective urgente requise"

    # =====================================
    # OK
    # =====================================

    else:

        cause = "Fonctionnement normal"
        solution = "Aucune intervention requise"

    # =====================================

    return jsonify({
        "prediction": prediction,
        "probability": round(probability, 4),
        "cause": cause,
        "solution": solution
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )