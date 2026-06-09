import React, {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../../services/api";

import Sidebar from "../../components/Sidebar";

import "../../styles/Admin/alerts.css";

import {
  FaTemperatureHigh,
  FaTools,
  FaClock,
  FaMicrochip
} from "react-icons/fa";

function Alerts() {

  const [alerts, setAlerts] =
    useState([]);

  const navigate =
    useNavigate();

  // =========================
  // LOAD ALERTS
  // =========================

  useEffect(() => {

    loadAlerts();

  }, []);

  const loadAlerts = async () => {

    try {

      const res =
        await API.get("/alerts");

      setAlerts(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(
        "Error loading alerts:",
        err
      );

    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (dateString) => {

    if (!dateString)
      return "-";

    const date =
      new Date(dateString);

    return date.toLocaleString();
  };

  // =========================
  // RENDER
  // =========================

  return (

    <div className="admin-layout">

      <Sidebar />

      <div className="admin-content">

        <div className="alerts-page">

          {/* HEADER */}

          <div className="page-header">

            <h1>
              Alerts Center
            </h1>

            <p>
              Real-time industrial monitoring notifications
            </p>

          </div>

          {/* EMPTY */}

          {
            alerts.length === 0 && (

              <div className="no-alerts">

                <h2>
                  No Alerts
                </h2>

                <p>
                  Everything is running normally.
                </p>

              </div>

            )
          }

          {/* ALERTS */}

          <div className="alerts-grid">

            {

              alerts.map((alert) => {

                const role =
                  localStorage.getItem("role");

                const isSeen =
                  role === "ADMIN"
                    ? alert.seenAdmin
                    : alert.seenTechnician;

                return (

                  <div
                    key={alert.id}
                    onClick={() =>
                      navigate(
                        `/alerts/${alert.id}`
                      )
                    }
                    className={`
                      alert-card
                      ${alert.level?.toLowerCase()}
                      ${isSeen ? "seen" : "unseen"}
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

                    {/* UNREAD DOT */}

                    {
                      !isSeen && (

                        <div className="alert-dot">

                        </div>

                      )
                    }

                  </div>

                );

              })

            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default Alerts;