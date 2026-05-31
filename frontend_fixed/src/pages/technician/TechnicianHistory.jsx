import React, {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

import {
  FaTools,
  FaClock,
  FaCalendarAlt,
  FaMicrochip,
  FaUserCog
} from "react-icons/fa";

import "../../styles/Technician/history.css";

function TechnicianHistory() {

  // Récupérer le domaine du technicien depuis le localStorage (stocké après connexion JWT)
  const domain = localStorage.getItem("domain");

  const [history, setHistory] =
    useState([]);

  // =========================
  // LOAD HISTORY
  // =========================

  useEffect(() => {

    loadHistory();

  }, []);

  const loadHistory = async () => {

    try {

      const res =
        await API.get(
          `/maintenance/domain/${domain}`
        );

      setHistory(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {

    if (!date)
      return "----";

    return new Date(date)
      .toLocaleString();
  };

  return (

    <div className="history-page">

      <div className="history-header">

        <h1>
          Historique Maintenance
        </h1>

        <p>
          Historique complet des interventions
        </p>

      </div>

      <div className="history-grid">

        {
          history.map((m) => (

            <div
              key={m.id}
              className="history-card"
            >

              <div className="card-top">

                <FaTools className="tool-icon" />

                <h2>
                  {m.action}
                </h2>

              </div>

              <div className="history-info">

                <p>

                  <FaMicrochip />

                  <span>

                    Equipement :

                    {" "}

                    {
                      m.equipment?.name
                    }

                  </span>

                </p>

                <p>

                  <FaUserCog />

                  <span>

                    Technicien :

                    {" "}

                    {m.technician}

                  </span>

                </p>

                <p>

                  <FaCalendarAlt />

                  <span>

                    Début :

                    {" "}

                    {
                      formatDate(
                        m.startDate
                      )
                    }

                  </span>

                </p>

                <p>

                  <FaCalendarAlt />

                  <span>

                    Fin :

                    {" "}

                    {
                      formatDate(
                        m.endDate
                      )
                    }

                  </span>

                </p>

                <p>

                  <FaClock />

                  <span>

                    Durée :

                    {" "}

                    {
                      m.durationMinutes
                    }

                    {" "}minutes

                  </span>

                </p>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}

export default TechnicianHistory;