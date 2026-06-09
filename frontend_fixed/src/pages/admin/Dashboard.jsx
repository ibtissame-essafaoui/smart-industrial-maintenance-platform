import React, { useEffect, useState } from "react";
import API from "../../services/api";
import Sidebar from "../../components/Sidebar";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  FaMicrochip,
  FaTemperatureHigh,
  FaExclamationTriangle,
  FaChartLine,
  FaClock,
} from "react-icons/fa";

import "../../styles/Admin/dashboard.css";

function Dashboard() {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {
    try {
      const res = await API.get("/equipments/with-data");
      setEquipments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setEquipments([]);
    }
  };

  // =========================
  // KPI
  // =========================

  const avgTemp =
    equipments.length > 0
      ? (
          equipments.reduce(
            (sum, eq) => sum + Number(eq.temperature || 0),
            0
          ) / equipments.length
        ).toFixed(1)
      : 0;

  const avgRuntime =
    equipments.length > 0
      ? (
          equipments.reduce(
            (sum, eq) => sum + Number(eq.runtime || 0),
            0
          ) / equipments.length
        ).toFixed(0)
      : 0;

  const avgVibration =
    equipments.length > 0
      ? (
          equipments.reduce(
            (sum, eq) => sum + Number(eq.vibration || 0),
            0
          ) / equipments.length
        ).toFixed(2)
      : 0;

  const avgPressure =
    equipments.length > 0
      ? (
          equipments.reduce(
            (sum, eq) => sum + Number(eq.pressure || 0),
            0
          ) / equipments.length
        ).toFixed(2)
      : 0;

  const criticalEquipments = equipments.filter(
    (eq) =>
      Number(eq.temperature || 0) >= 100 ||
      eq.status === "EN_PANNE"
  ).length;

  const activeEquipments = equipments.filter(
    (eq) => eq.status === "ACTIF"
  ).length;

  // =========================
  // PIE DATA
  // =========================

  const pieData = [
    {
      name: "Critical",
      value: criticalEquipments,
    },
    {
      name: "Active",
      value: activeEquipments,
    },
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  // =========================
  // CHART DATA
  // =========================

  const chartData = equipments.map((eq) => ({
    id: eq.id,
    equipmentName: eq.name || `Equipment ${eq.id}`,
    temperature: Number(eq.temperature || 0),
    runtime: Number(eq.runtime || 0),
    vibration: Number(eq.vibration || 0),
    pressure: Number(eq.pressure || 0),
  }));

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="dashboard-page">

        {/* HEADER */}

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Smart Maintenance Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Industrial Monitoring Platform
            </p>
          </div>
        </div>

        {/* KPI */}

        <div className="kpi-grid">

        <div className="kpi-card orange">
            <div className="kpi-icon">
              <FaTemperatureHigh />
            </div>

            <div>
              <span>Average Temperature</span>
              <h2>{avgTemp} °C</h2>
            </div>
          </div>

          <div className="kpi-card blue">
            <div className="kpi-icon">
              <FaClock />
            </div>

            <div>
              <span>Average Runtime</span>
              <h2>{avgRuntime} h</h2>
            </div>
          </div>

          <div className="kpi-card purple">
            <div className="kpi-icon">📳</div>

            <div>
              <span>Average Vibration</span>
              <h2>{avgVibration}</h2>
            </div>
          </div>

          <div className="kpi-card cyan">
            <div className="kpi-icon">⚙️</div>

            <div>
              <span>Average Pressure</span>
              <h2>{avgPressure} bar</h2>
            </div>
          </div>

          <div className="kpi-card red">
            <div className="kpi-icon">
              <FaExclamationTriangle />
            </div>

            <div>
              <span>Critical Equipments</span>
              <h2>{criticalEquipments}</h2>
            </div>
          </div>

          <div className="kpi-card green">
            <div className="kpi-icon">
              <FaMicrochip />
            </div>

            <div>
              <span>Total Equipments</span>
              <h2>{equipments.length}</h2>
            </div>
          </div>

        </div>

        {/* TEMPERATURE + STATUS */}

        <div className="main-grid">

          <div className="chart-card">

            <div className="card-title">
              <div className="title-icon">
                <FaChartLine />
              </div>

              <h2>Temperature Analysis</h2>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="equipmentName" />
                <YAxis />
                <Tooltip />
               <Area
  type="monotone"
  dataKey="temperature"
  stroke="#ed560b"
  fill="#ff4112"
  fillOpacity={0.8}
/>
              </AreaChart>
            </ResponsiveContainer>

          </div>

          <div className="status-card">

            <div className="card-title">
              <div className="title-icon">
                <FaChartLine />
              </div>

              <h2>Equipment Status</h2>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* RUNTIME */}

        <div className="chart-card full-width">

          <div className="card-title">
            <div className="title-icon">
              <FaChartLine />
            </div>
            <h2>Runtime Analytics</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="equipmentName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
  dataKey="runtime"
  fill="#11aa28"
  name="Runtime (h)"
  radius={[8, 8, 0, 0]}
/>
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* VIBRATION */}

        <div className="chart-card full-width">

          <div className="card-title">
            <div className="title-icon">
              <FaChartLine />
            </div>

            <h2>Vibration Analytics</h2>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="equipmentName" />
              <YAxis />
              <Tooltip />
              <Legend />

             <Bar
  dataKey="vibration"
  fill="#3e278f"
  name="Vibration"
  radius={[8, 8, 0, 0]}
/>
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* PRESSURE */}

        <div className="chart-card full-width">

          <div className="card-title">
            <div className="title-icon">
              <FaChartLine />
            </div>

            <h2>Pressure Analytics</h2>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="equipmentName" />
              <YAxis />
              <Tooltip />

              <Area
  type="monotone"
  dataKey="pressure"
  stroke="#0891b2"
  fill="#67e8f9"
  fillOpacity={0.8}
/>
            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* TABLE */}

        <div className="table-card">

          <div className="card-title">
            <FaMicrochip />
            <h2>Equipments Overview</h2>
          </div>

          <table>

            <thead>
              <tr>
                <th>ID-equipement</th>
                <th>Name</th>
                <th>Temperature</th>
                <th>Runtime</th>
                <th>Vibration</th>
                <th>Pressure</th>
              </tr>
            </thead>

            <tbody>

              {equipments.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    No equipment data available
                  </td>
                </tr>
              ) : (
                equipments.map((eq) => (
                  <tr key={eq.id}>

                    <td>#{eq.id}</td>

                    <td>{eq.name}</td>

                    <td>
                      <span
                        className={
                          Number(eq.temperature || 0) >= 100
                            ? "danger-text"
                            : "normal-text"
                        }
                      >
                        {eq.temperature || 0} °C
                      </span>
                    </td>

                    <td>{eq.runtime || 0} h</td>

                    <td>{eq.vibration || 0}</td>

                    <td>{eq.pressure || 0} bar</td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;