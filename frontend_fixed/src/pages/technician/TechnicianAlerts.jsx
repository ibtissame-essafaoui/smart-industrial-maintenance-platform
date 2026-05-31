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

  // Récupérer le domaine du technicien depuis le localStorage (stocké après connexion JWT)
  const domain = localStorage.getItem("domain");

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

      // équipements domaine

      const equipmentsRes =
        await API.get(
          `/equipments/domain/${domain}`
        );

      const equipments =
        equipmentsRes.data;

      // alertes

      const alertsRes =
        await API.get("/alerts");

      // filtrage domaine

      const filteredAlerts =
        alertsRes.data.filter(

          (alert) =>

            equipments.some(
              (eq) =>
                eq.id ===
                alert.equipment?.id
            )
        );

      // tri date

      filteredAlerts.sort(

        (a, b) =>

          new Date(b.date) -
          new Date(a.date)
      );

      setAlerts(
        filteredAlerts
      );

    } catch(err){

      console.log(err);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (dateString) => {

    const date =
      new Date(dateString);

    return date.toLocaleString();
  };

  // =========================
  // OPEN ALERT
  // =========================

  const openAlert =
    async (alertId) => {

      try {

        // mark as read

        await API.put(
          `/alerts/read/${alertId}`
        );

        // update frontend instant

        setAlerts((prev) =>

          prev.map((a) =>

            a.id === alertId

              ? {
                  ...a,
                  seen:true
                }

              : a
          )
        );

        // navigate

        navigate(
          `/technician/alerts/${alertId}`
        );

      } catch(err){

        console.log(err);
      }
    };

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
                ${alert.level.toLowerCase()}
                ${alert.seen ? "seen" : "unseen"}
              `}
            >

              {/* TIME */}

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

                  alert.message.includes(
                    "Température"
                  )

                  ?

                  <FaTemperatureHigh />

                  :

                  alert.message.includes(
                    "Runtime"
                  )

                  ?

                  <FaClock />

                  :

                  <FaTools />
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
                !alert.seen && (

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