import React, {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import API from "../../services/api";
import Sidebar from "../../components/Sidebar";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaMicrochip,
  FaTools,
  FaCalendarAlt,
  FaCheckCircle,
  FaThermometerHalf,
  FaClock
} from "react-icons/fa";

import "../../styles/Admin/alertDetails.css";

function AlertDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [alert, setAlert] =
  useState(null);

  // =========================
  // LOAD ALERT
  // =========================

  useEffect(() => {

    loadAlert();

    markAsRead();

  }, [id]);

  // =========================
  // GET ALERT
  // =========================

  const loadAlert = async () => {

    try {

      const res =
      await API.get(`/alerts/${id}`);

      setAlert(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // MARK AS READ
  // =========================

  const markAsRead = async () => {

    try {

      await API.put(`/alerts/read/${id}`);

    } catch (err) {

      console.log(err);
    }
  };

  // =========================
  // ICON
  // =========================

  const getIcon = () => {

    if (
      alert.message.includes("Température")
    ) {

      return <FaThermometerHalf />;
    }

    return <FaClock />;
  };

  // =========================
  // LOADING
  // =========================

  if (!alert) {

    return (

      <div className="loading-page">

        Chargement...

      </div>
    );
  }

  return (

    <div className="alert-details-page">

      {/* BACK */}

      <button
        className="back-btn"
        onClick={() =>
          navigate("/alerts")
        }
      >

        <FaArrowLeft />

        Retour

      </button>

      {/* CARD */}

      <div className="details-card">

        {/* HEADER */}

        <div className="details-header">

          <div
            className={`
              alert-big-icon
              ${alert.level.toLowerCase()}
            `}
          >

            {getIcon()}

          </div>

          <div>

            <p className="details-subtitle">

              Surveillance Industrielle

            </p>

            <h1>

              {alert.message}

            </h1>

            <span
              className={`
                details-level
                ${alert.level.toLowerCase()}
              `}
            >

              {alert.level}

            </span>

          </div>

        </div>

        {/* INFOS */}

        <div className="details-grid">

          {/* EQUIPMENT */}

          <div className="detail-box">

            <div className="detail-icon">

              <FaMicrochip />

            </div>

            <div>

              <span>
                Équipement
              </span>

              <h3>
                {alert.equipment?.name}
              </h3>

            </div>

          </div>

          {/* TYPE */}

          <div className="detail-box">

            <div className="detail-icon">

              <FaTools />

            </div>

            <div>

              <span>
                Type
              </span>

              <h3>
                {alert.equipment?.type}
              </h3>

            </div>

          </div>

          {/* DATE */}

          <div className="detail-box">

            <div className="detail-icon">

              <FaCalendarAlt />

            </div>

            <div>

              <span>
                Date
              </span>

              <h3>

                {
                  new Date(alert.date)
                  .toLocaleString()
                }

              </h3>

            </div>

          </div>

          {/* STATUS */}

          <div className="detail-box">

            <div className="detail-icon success">

              <FaCheckCircle />

            </div>

            <div>

              <span>
                Statut
              </span>

              <h3>

                Consultée

              </h3>

            </div>

          </div>

        </div>

        {/* CAUSE */}

        <div className="analysis-section">

          <h2>

            <FaExclamationTriangle />

            Analyse de l’alerte

          </h2>

          <p>

            {alert.cause}

          </p>

        </div>

      </div>

    </div>
  );
}

export default AlertDetails;