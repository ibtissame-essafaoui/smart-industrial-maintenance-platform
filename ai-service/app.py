
from flask import Flask, request, jsonify

app = Flask(__name__)

# =====================================
# IA PREDICT API
# =====================================

@app.route('/predict', methods=['POST'])
def predict():

    data = request.json

    temperature = float(
        data.get("temperature", 0)
    )

    runtime = float(
        data.get("runtime", 0)
    )

    prediction = "OK"
    probability = 0.99

    analysis = ""
    cause = ""
    solution = ""

    # =====================================
    # PANNE
    # =====================================

    if (
        temperature >= 105
        or runtime >= 2200
    ):

        prediction = "PANNE"
        probability = 0.98

        analysis = (
            "Panne imminente détectée."
        )

        if temperature >= 105:

            cause = (
                "Surchauffe critique moteur."
            )

            solution = (
                "Arrêter immédiatement l’équipement."
            )

        else:

            cause = (
                "Durée excessive de fonctionnement."
            )

            solution = (
                "Maintenance complète urgente."
            )

    # =====================================
    # RISQUE
    # =====================================

    elif (
        temperature >= 90
        or runtime >= 1500
    ):

        prediction = "RISQUE"
        probability = 0.80

        analysis = (
            "Risque de panne détecté."
        )

        if temperature >= 90:

            cause = (
                "Température élevée."
            )

            solution = (
                "Vérifier le système de refroidissement."
            )

        else:

            cause = (
                "Usure avancée des composants."
            )

            solution = (
                "Prévoir maintenance préventive."
            )

    # =====================================
    # OK
    # =====================================

    else:

        prediction = "OK"
        probability = 0.99

        analysis = (
            "Equipement stable."
        )

        cause = (
            "Aucun problème détecté."
        )

        solution = (
            "Continuer surveillance normale."
        )

    return jsonify({

        "prediction": prediction,

        "probability": probability,

        "analysis": analysis,

        "cause": cause,

        "solution": solution
    })

# =====================================
# RUN SERVER
# =====================================

if __name__ == '__main__':

    app.run(
        debug=True,
        port=5000
    )

