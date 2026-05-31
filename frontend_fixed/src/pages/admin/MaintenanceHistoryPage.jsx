import React, {
  useEffect,
  useState
} from "react";

import API from "../../services/api";

import Sidebar from "../../components/Sidebar";

import {
  FaTools,
  FaUser,
  FaClock,
  FaMicrochip
} from "react-icons/fa";

import "../../styles/Admin/maintenanceHistory.css";

function MaintenanceHistoryPage() {

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
        await API.get("/maintenance");

      setHistory(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(err);
    }
  };

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* PAGE */}

      <div className="history-page">

        {/* HEADER */}

        <div className="history-header">

          <FaTools className="history-icon" />

          <div>

            <h1>
              Historique Maintenance
            </h1>

            <p>
              Interventions techniques
            </p>

          </div>

        </div>

        {/* TABLE */}

        <div className="history-table-container">

          <table className="history-table">

            <thead>

              <tr>

                <th>
                  Equipement
                </th>

                <th>
                  Technicien
                </th>

                <th>
                  Action
                </th>

                <th>
                  Début
                </th>

                <th>
                  Fin
                </th>

                <th>
                  Durée
                </th>

              </tr>

            </thead>

            <tbody>

              {
                history.map((item) => (

                  <tr key={item.id}>

                    {/* EQUIPMENT */}

                    <td>

                      <div className="td-flex">

                        <FaMicrochip />

                        {
                          item.equipment?.name
                        }

                      </div>

                    </td>

                    {/* TECHNICIAN */}

                    <td>

                      <div className="td-flex">

                        <FaUser />

                        {
                          item.technician ||
                          "N/A"
                        }

                      </div>

                    </td>

                    {/* ACTION */}

                    <td>

                      {
                        item.action ||
                        "Maintenance démarrée"
                      }

                    </td>

                    {/* START */}

                    <td>

                      {
                        item.startDate
                          ? new Date(
                              item.startDate
                            ).toLocaleString()
                          : "-"
                      }

                    </td>

                    {/* END */}

                    <td>

                      {
                        item.endDate
                          ? new Date(
                              item.endDate
                            ).toLocaleString()
                          : "-"
                      }

                    </td>

                    {/* DURATION */}

                    <td>

                      <div className="duration">

                        <FaClock />

                        {
                          item.durationMinutes
                            ? `${item.durationMinutes} min`
                            : "En cours"
                        }

                      </div>

                    </td>

                  </tr>
                ))
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default MaintenanceHistoryPage;