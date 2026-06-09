import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "../../components/Sidebar";

import {
  FaTools,
  FaUser,
  FaClock,
  FaMicrochip,
  FaSearch
} from "react-icons/fa";

import "../../styles/Admin/maintenanceHistory.css";

function MaintenanceHistoryPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await API.get("/maintenance");

      setHistory(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHistory = history.filter((item) => {
    const keyword = search.toLowerCase();

    return (
      item.equipment?.name
        ?.toLowerCase()
        .includes(keyword) ||
      item.technician
        ?.toLowerCase()
        .includes(keyword) ||
      item.action
        ?.toLowerCase()
        .includes(keyword)
    );
  });

  const totalInterventions =
    history.length;

  const finishedInterventions =
    history.filter(
      (item) => item.endDate
    ).length;

  const runningInterventions =
    history.filter(
      (item) => !item.endDate
    ).length;

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="history-page">

        {/* HEADER */}

        <div className="history-header">

          <FaTools className="history-icon" />

          <div>
            <h1>
              Maintenance History
            </h1>

            <p>
              Track all maintenance interventions
            </p>
          </div>

        </div>

        {/* KPI */}

        <div className="stats-grid">

          <div className="stat-card">
            <h3>
              {totalInterventions}
            </h3>

            <p>
              Total Interventions
            </p>
          </div>

          <div className="stat-card">
            <h3>
              {runningInterventions}
            </h3>

            <p>
              Running
            </p>
          </div>

          <div className="stat-card">
            <h3>
              {finishedInterventions}
            </h3>

            <p>
              Finished
            </p>
          </div>

        </div>

        {/* SEARCH */}

        <div className="search-container">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search maintenance..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="history-table-container">

          <table className="history-table">

            <thead>

              <tr>

                <th>Equipment</th>

                <th>Technician</th>

                <th>Action</th>

                <th>Start Date</th>

                <th>End Date</th>

                <th>Duration</th>

              </tr>

            </thead>

            <tbody>

              {filteredHistory.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "30px"
                    }}
                  >
                    No maintenance found
                  </td>

                </tr>

              ) : (

                filteredHistory.map(
                  (item) => (

                    <tr
                      key={item.id}
                    >

                      <td>

                        <div className="td-flex">

                          <FaMicrochip />

                          {item.equipment?.name ||
                            "N/A"}

                        </div>

                      </td>

                      <td>

                        <div className="td-flex">

                          <FaUser />

                          {item.technician ||
                            "N/A"}

                        </div>

                      </td>

                      <td>

                        {item.action ||
                          "Maintenance Started"}

                      </td>

                      <td>

                        {item.startDate
                          ? new Date(
                              item.startDate
                            ).toLocaleString()
                          : "-"}

                      </td>

                      <td>

                        {item.endDate
                          ? new Date(
                              item.endDate
                            ).toLocaleString()
                          : "-"}

                      </td>

                      <td>

                        <div className="duration">

                          <FaClock />

                          {item.durationMinutes
                            ? `${item.durationMinutes} min`
                            : "Running"}

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default MaintenanceHistoryPage;