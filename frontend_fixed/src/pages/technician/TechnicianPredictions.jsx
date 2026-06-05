import React, { useEffect, useState } from "react";

import API from "../../services/api";

import "../../styles/Technician/technicianPredictions.css";

import {
  FaBrain,
  FaMicrochip,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
} from "react-icons/fa";

function TechnicianPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const domain =
    localStorage.getItem("domain") || "";

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);

     
    console.log("DOMAIN =", domain);

    const res = await API.get(
      `/predictions/domain/${domain}`
    );
      const data = res.data || [];

      // Latest prediction par équipement
      const latestMap = {};

      data.forEach((item) => {
        const equipmentId =
          item.equipment?.id;

        if (!equipmentId) return;

        if (!latestMap[equipmentId]) {
          latestMap[equipmentId] = item;
        } else {
          const currentDate = new Date(
            item.date
          );

          const savedDate = new Date(
            latestMap[equipmentId].date
          );

          if (currentDate > savedDate) {
            latestMap[equipmentId] = item;
          }
        }
      });

      setPredictions(
        Object.values(latestMap)
      );
    } catch (error) {
      console.error(
        "Erreur chargement predictions",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // CARD COLOR
  // ======================

  const getCardClass = (result) => {
    if (!result) return "success";

    const value = result.toUpperCase();

    if (value.includes("PANNE"))
      return "danger";

    if (value.includes("RISQUE"))
      return "warning";

    return "success";
  };

  // ======================
  // STATUS TEXT
  // ======================

  const getStatusText = (result) => {
    if (!result)
      return "Fonctionnement normal";

    const value = result.toUpperCase();

    if (value.includes("PANNE"))
      return "Panne critique imminente";

    if (value.includes("RISQUE"))
      return "Risque élevé détecté";

    return "Fonctionnement normal";
  };

  // ======================
  // ICON
  // ======================

  const getIcon = (result) => {
    if (!result)
      return <FaCheckCircle />;

    const value = result.toUpperCase();

    if (value.includes("PANNE"))
      return <FaTimesCircle />;

    if (value.includes("RISQUE"))
      return (
        <FaExclamationTriangle />
      );

    return <FaCheckCircle />;
  };

  return (
    <div className="prediction-page">
      {/* HEADER */}

      <div className="prediction-header">
        <FaBrain className="brain-icon" />

        <div>
          <h1>
            IA Predictions - {domain}
          </h1>

          <p>
            Analyse intelligente des
            équipements du domaine
          </p>
        </div>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="empty-predictions">
          <h3>Chargement...</h3>
        </div>
      ) : predictions.length === 0 ? (
        <div className="empty-predictions">
          <h3>
            Aucune prédiction disponible
            pour le domaine {domain}
          </h3>
        </div>
      ) : (
        <div className="prediction-grid">
          {predictions.map((item) => (
            <div
              key={item.id}
              className={`prediction-card ${getCardClass(
                item.result
              )}`}
            >
              {/* TOP */}

              <div className="prediction-top">
                <div
                  className={`prediction-icon ${getCardClass(
                    item.result
                  )}`}
                >
                  {getIcon(item.result)}
                </div>

                <h2
                  className={`prediction-title status-${getCardClass(
                    item.result
                  )}`}
                >
                  {getStatusText(
                    item.result
                  )}
                </h2>
              </div>

              {/* INFO */}

              <div className="prediction-info">
                <p className="equipment-name">
                  <FaMicrochip />

                  {" "}
                  {item.equipment?.name}
                </p>

                <p className="equipment-domain">
                  Domaine :
                  {" "}
                  {
                    item.equipment
                      ?.domain
                  }
                </p>

                <h4>
                  Probabilité :
                  {" "}
                  {Math.round(
                    item.probability *
                      100
                  )}
                  %
                </h4>

                <div className="progress-bar">
                  <div
                    className={`progress-fill ${getCardClass(
                      item.result
                    )}`}
                    style={{
                      width: `${
                        item.probability *
                        100
                      }%`,
                    }}
                  />
                </div>

                <div className="prediction-detail">
                  <h5>Cause :</h5>

                  <p>
                    {item.cause ||
                      "Aucune cause détectée"}
                  </p>
                </div>

                <div className="prediction-detail">
                  <h5>
                    <FaTools />

                    {" "}
                    Solution :
                  </h5>

                  <p>
                    {item.solution ||
                      "Aucune solution recommandée"}
                  </p>
                </div>

                <span className="prediction-date">
                  {new Date(
                    item.date
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TechnicianPredictions;