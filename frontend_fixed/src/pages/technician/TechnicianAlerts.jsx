import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../../services/api";

import "../../styles/Admin/alerts.css";

import {
  FaTemperatureHigh,
  FaTools,
  FaClock,
  FaMicrochip
} from "react-icons/fa";

function TechnicianAlerts() {

  const navigate =
    useNavigate();

  const domain =
    localStorage.getItem("domain");

  const [
    alerts,
    setAlerts
  ] = useState([]);

  // =========================
  // LOAD ALERTS
  // =========================

  useEffect(() => {

    loadAlerts();

  }, []);

  const loadAlerts = async () => {

    try {

      const res =
        await API.get(
          `/alerts/domain/${domain}`
        );

      const sortedAlerts =
        [...res.data].sort(

          (a, b) =>

            new Date(b.date) -
            new Date(a.date)

        );

      setAlerts(
        sortedAlerts
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (
    dateString
  ) => {

    if (!dateString)
      return "-";

    return new Date(
      dateString
    ).toLocaleString();
  };

  // =========================
  // OPEN ALERT
  // =========================

  const openAlert =
    async (alertId) => {

      try {

        await API.put(
          `/alerts/technician/read/${alertId}`
        );

        setAlerts((prev) =>

          prev.map((a) =>

            a.id === alertId

              ? {
                  ...a,
                  seenTechnician: true
                }

              : a
          )
        );

        navigate(
          `/technician/alerts/${alertId}`
        );

      } catch (err) {

        console.log(err);

      }
    };

  // =========================
  // RENDER
  // =========================

  return (

    <div className="alerts-page">

      {/* HEADER */}

      <div className="page-header">

        <h1>
          Centre des Alertes
        </h1>

        <p>

          Domaine :

          {" "}

          <strong>
            {domain}
          </strong>

        </p>

      </div>

      {/* EMPTY */}

      {
        alerts.length === 0 && (

          <div className="no-alerts">

            <h2>
              Aucune Alerte
            </h2>

            <p>
              Aucun problème détecté
            </p>

          </div>
        )
      }

      {/* ALERTS */}

      <div className="alerts-grid">

        {

          alerts.map((alert) => (

            <div

              key={alert.id}

              onClick={() =>
                openAlert(alert.id)
              }

              className={`
                alert-card
                ${alert.level?.toLowerCase()}
                ${
                  alert.seenTechnician
                    ? "seen"
                    : "unseen"
                }
              `}
            >

              {/* DATE */}

              <div className="alert-time">

                {
                  formatDate(
                    alert.date
                  )
                }

              </div>

              {/* ICON */}

              <div className="alert-icon-box">

                {

                  alert.message?.includes(
                    "Température"
                  )

                    ? <FaTemperatureHigh />

                    : alert.message?.includes(
                        "Runtime"
                      )

                    ? <FaClock />

                    : <FaTools />
                }

              </div>

              {/* CONTENT */}

              <div className="alert-content">

                <div className="equipment-row">

                  <FaMicrochip />

                  <span>

                    {
                      alert.equipment?.name
                    }

                  </span>

                </div>

                <div className="equipment-type">

                  {
                    alert.equipment?.type
                  }

                </div>

                <h3>

                  {alert.message}

                </h3>

                <span className="alert-level">

                  {alert.level}

                </span>

              </div>

              {

                !alert.seenTechnician && (

                  <div className="alert-dot">

                  </div>

                )

              }

            </div>

          ))

        }

      </div>

    </div>
  );
}

export default TechnicianAlerts;