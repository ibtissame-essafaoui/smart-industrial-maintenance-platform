import React, {
  useEffect,
  useState
} from "react";

import API from "../../services/api";

import Sidebar from "../../components/Sidebar";

import {
  FaBrain,
  FaMicrochip,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTools
} from "react-icons/fa";

import "../../styles/Admin/predictions.css";

function PredictionPage() {

  const [predictions, setPredictions] =
    useState([]);

  useEffect(() => {

    loadPredictions();

  }, []);

  const loadPredictions = async () => {

    try {

      const res =
        await API.get(
          "/predictions/latest"
        );

      setPredictions(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  const getCardClass = (result) => {

    if (!result)
      return "success";

    const value =
      result.toUpperCase();

    if (value.includes("PANNE"))
      return "danger";

    if (value.includes("RISQUE"))
      return "warning";

    return "success";
  };

  const getStatusText = (result) => {

    if (!result)
      return "Fonctionnement normal";

    const value =
      result.toUpperCase();

    if (value.includes("PANNE"))
      return "Panne critique imminente";

    if (value.includes("RISQUE"))
      return "Risque élevé détecté";

    return "Fonctionnement normal";
  };

  const getIcon = (result) => {

    if (!result)
      return <FaCheckCircle />;

    const value =
      result.toUpperCase();

    if (value.includes("PANNE"))
      return <FaTimesCircle />;

    if (value.includes("RISQUE"))
      return <FaExclamationTriangle />;

    return <FaCheckCircle />;
  };

  return (

    <div className="dashboard-container">

      <Sidebar />

      <div className="prediction-page">

        {/* HEADER */}

        <div className="prediction-header">

          <FaBrain className="brain-icon" />

          <div>

            <h1>
              Intelligence Artificielle
            </h1>

            <p>
              Analyse prédictive industrielle
            </p>

          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">
            <h3>Total Predictions</h3>
            <p>{predictions.length}</p>
          </div>

          <div className="stat-card danger">
            <h3>Pannes critiques</h3>
            <p>
              {
                predictions.filter(
                  p =>
                    p.result
                      ?.toUpperCase()
                      .includes("PANNE")
                ).length
              }
            </p>
          </div>

          <div className="stat-card warning">
            <h3>Risques détectés</h3>
            <p>
              {
                predictions.filter(
                  p =>
                    p.result
                      ?.toUpperCase()
                      .includes("RISQUE")
                ).length
              }
            </p>
          </div>

          <div className="stat-card success">
            <h3>Fonctionnement normal</h3>
            <p>
              {
                predictions.filter(
                  p =>
                    p.result
                      ?.toUpperCase()
                      .includes("OK")
                ).length
              }
            </p>
          </div>

        </div>

        {/* PREDICTIONS */}

        <div className="prediction-grid">

          {predictions.map((item) => (

            <div
              key={item.id}
              className={`prediction-card ${getCardClass(item.result)}`}
            >

              <div className="prediction-top">

                <div
                  className={`prediction-icon ${getCardClass(item.result)}`}
                >
                  {getIcon(item.result)}
                </div>

                <h2
                  className={`prediction-title status-${getCardClass(item.result)}`}
                >
                  {getStatusText(item.result)}
                </h2>

              </div>

              <div className="prediction-info">

                <p className="equipment-name">

                  <FaMicrochip />

                  {" "}

                  {item.equipment?.name}

                </p>

                <h4>
                  Probabilité :
                  {" "}
                  {Math.round(item.probability * 100)}%
                </h4>

                <div className="progress-bar">

                  <div
                    className={`progress-fill ${getCardClass(item.result)}`}
                    style={{
                      width: `${item.probability * 100}%`
                    }}
                  />

                </div>

                <div className="prediction-detail">

                  <h5>Cause :</h5>

                  <p>
                    {
                      item.cause
                        ? item.cause
                        : "Aucune cause détectée"
                    }
                  </p>

                </div>

                <div className="prediction-detail">

                  <h5>

                    <FaTools />

                    {" "}
                    Solution :

                  </h5>

                  <p>
                    {
                      item.solution
                        ? item.solution
                        : "Aucune solution recommandée"
                    }
                  </p>

                </div>

                <span className="prediction-date">

                  {
                    new Date(item.date)
                      .toLocaleString()
                  }

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default PredictionPage;