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
  Legend
} from "recharts";

import {
  FaMicrochip,
  FaTemperatureHigh,
  FaExclamationTriangle,
  FaChartLine,
  FaClock,
  FaTools
} from "react-icons/fa";

import "../../styles/Admin/dashboard.css";

function Dashboard() {

  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {

    try {

      const res =
        await API.get(
          "/equipments/with-data"
        );

      setEquipments(
        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.log(err);

    }
  };

  // ============================
  // KPI
  // ============================

  const avgTemp =
    equipments.length > 0
      ? (
          equipments.reduce(
            (sum, eq) =>
              sum + (eq.temperature || 0),
            0
          ) / equipments.length
        ).toFixed(1)
      : 0;

  const avgRuntime =
    equipments.length > 0
      ? (
          equipments.reduce(
            (sum, eq) =>
              sum + (eq.runtime || 0),
            0
          ) / equipments.length
        ).toFixed(0)
      : 0;

  const criticalEquipments =
    equipments.filter(
      eq =>
        (eq.temperature || 0) >= 100 ||
        eq.status === "EN_PANNE"
    ).length;

  const activeEquipments =
    equipments.filter(
      eq =>
        eq.status === "ACTIF"
    ).length;

  // ============================
  // PIE
  // ============================

  const pieData = [
    {
      name: "Critical",
      value: criticalEquipments
    },
    {
      name: "Active",
      value: activeEquipments
    }
  ];

  const COLORS = [
    "#ef4444",
    "#22c55e"
  ];

  // ============================
  // CHART DATA
  // ============================

  const chartData =
    equipments.map((eq) => ({

      id: eq.id,

      equipmentName:
        eq.name,

      domaine:
        eq.domaine || "N/A",

      temperature:
        eq.temperature || 0,

      runtime:
        eq.runtime || 0

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

          <div className="kpi-card blue">

            <div className="kpi-icon">
              <FaTemperatureHigh />
            </div>

            <div>

              <span>
                Average Temperature
              </span>

              <h2>
                {avgTemp} °C
              </h2>

            </div>

          </div>

          <div className="kpi-card orange">

            <div className="kpi-icon">
              <FaClock />
            </div>

            <div>

              <span>
                Average Runtime
              </span>

              <h2>
                {avgRuntime} h
              </h2>

            </div>

          </div>

          <div className="kpi-card red">

            <div className="kpi-icon">
              <FaExclamationTriangle />
            </div>

            <div>

              <span>
                Critical Equipments
              </span>

              <h2>
                {criticalEquipments}
              </h2>

            </div>

          </div>

          <div className="kpi-card green">

            <div className="kpi-icon">
              <FaMicrochip />
            </div>

            <div>

              <span>
                Total Equipments
              </span>

              <h2>
                {equipments.length}
              </h2>

            </div>

          </div>

        </div>

        {/* CHARTS */}

        <div className="main-grid">

          <div className="chart-card">

            <div className="card-title">

              <FaChartLine />

              <h2>
                Temperature Analysis
              </h2>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <AreaChart
                data={chartData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="equipmentName"
                />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

          <div className="status-card">

            <div className="card-title">

              <FaTools />

              <h2>
                Equipment Status
              </h2>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >

                  {
                    pieData.map(
                      (entry, index) => (

                        <Cell
                          key={index}
                          fill={COLORS[index]}
                        />

                      )
                    )
                  }

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

            <FaClock />

            <h2>
              Runtime Analytics
            </h2>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

            <BarChart
              data={chartData}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="equipmentName"
              />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="runtime"
                fill="#f97316"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* TABLE */}

        <div className="table-card">

          <div className="card-title">

            <FaMicrochip />

            <h2>
              Equipments Overview
            </h2>

          </div>

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Domaine</th>
                <th>Temperature</th>
                <th>Runtime</th>
                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {
                equipments.map(
                  (eq) => (

                    <tr key={eq.id}>

                      <td>
                        #{eq.id}
                      </td>

                      <td>
                        {eq.name}
                      </td>

                      <td>
                        {eq.domaine || "-"}
                      </td>

                      <td>

                        <span
                          className={
                            eq.temperature >= 100
                              ? "danger-text"
                              : "normal-text"
                          }
                        >

                          {eq.temperature || 0}°C

                        </span>

                      </td>

                      <td>

                        {eq.runtime || 0} h

                      </td>

                      <td>

                        <span
                          className={
                            eq.status === "EN_PANNE"
                              ? "status critical"
                              : eq.status === "EN_MAINTENANCE"
                              ? "status maintenance"
                              : "status running"
                          }
                        >

                          {eq.status}

                        </span>

                      </td>

                    </tr>

                  )
                )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;