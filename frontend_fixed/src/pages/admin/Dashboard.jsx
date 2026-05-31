import React, {
  useEffect,
  useState
} from "react";

import API from "../../services/api";

import Sidebar from "../../components/Sidebar";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

import {
  FaMicrochip,
  FaTemperatureHigh,
  FaTools,
  FaExclamationTriangle,
  FaChartLine,
  FaClock
} from "react-icons/fa";

import "../../styles/Admin/dashboard.css";

function Dashboard() {

  const [data, setData] =
    useState([]);

  const [latestData, setLatestData] =
    useState([]);

  // =========================================
  // LOAD DATA
  // =========================================

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const response =
        await API.get("/data");

      const allData =
        Array.isArray(response.data)
          ? response.data
          : [];

      setData(allData);

      // LAST 10 DATA

      setLatestData(
        [...allData]
          .reverse()
          .slice(0, 10)
      );

    } catch (error) {

      console.log(error);

    }
  };

  // =========================================
  // KPI
  // =========================================

  const avgTemp =

    data.length > 0

      ? (

          data.reduce(
            (a, b) =>
              a + b.temperature,
            0
          ) / data.length

        ).toFixed(1)

      : 0;

  const avgRuntime =

    data.length > 0

      ? (

          data.reduce(
            (a, b) =>
              a + b.runtime,
            0
          ) / data.length

        ).toFixed(0)

      : 0;

  const critical =

    data.filter(
      d =>
        d.temperature >= 100
        || d.runtime >= 2000
    ).length;

  const activeMachines =

    data.filter(
      d =>
        d.temperature < 100
    ).length;

  // =========================================
  // PIE DATA
  // =========================================

  const pieData = [

    {
      name: "Critical",
      value: critical
    },

    {
      name: "Normal",
      value: activeMachines
    }

  ];

  const COLORS = [

    "#ef4444",
    "#22c55e"

  ];

  // =========================================
  // FORMAT CHART
  // =========================================

  const chartData =
    latestData.map((d) => ({

      id: d.id,

      temperature:
        d.temperature,

      runtime:
        d.runtime

    }));

  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="dashboard-layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* CONTENT */}

      <div className="dashboard-page">

        {/* HEADER */}

        <div className="dashboard-header">

          <div>

            <h1 className="dashboard-title">
              Smart Maintenance
            </h1>

            <p className="dashboard-subtitle">
              AI Industrial Monitoring Platform
            </p>

          </div>

        </div>

        {/* KPI */}

        <div className="kpi-grid">

          {/* TEMP */}

          <div className="kpi-card blue">

            <div className="kpi-icon">
              <FaTemperatureHigh />
            </div>

            <div>

              <span>
                Average Temp
              </span>

              <h2>
                {avgTemp}°C
              </h2>

            </div>

          </div>

          {/* RUNTIME */}

          <div className="kpi-card orange">

            <div className="kpi-icon">
              <FaClock />
            </div>

            <div>

              <span>
                Avg Runtime
              </span>

              <h2>
                {avgRuntime} h
              </h2>

            </div>

          </div>

          {/* CRITICAL */}

          <div className="kpi-card red">

            <div className="kpi-icon">
              <FaExclamationTriangle />
            </div>

            <div>

              <span>
                Critical Alerts
              </span>

              <h2>
                {critical}
              </h2>

            </div>

          </div>

          {/* TOTAL */}

          <div className="kpi-card green">

            <div className="kpi-icon">
              <FaMicrochip />
            </div>

            <div>

              <span>
                Total Data
              </span>

              <h2>
                {data.length}
              </h2>

            </div>

          </div>

        </div>

        {/* CHARTS */}

        <div className="main-grid">

          {/* AREA CHART */}

          <div className="chart-card">

            <div className="card-title">

              <FaChartLine />

              <h2>
                Temperature Evolution
              </h2>

            </div>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <AreaChart
                data={chartData}
              >

                <defs>

                  <linearGradient
                    id="colorTemp"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="#3b82f6"
                      stopOpacity={0.8}
                    />

                    <stop
                      offset="95%"
                      stopColor="#3b82f6"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="id" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

          {/* PIE */}

          <div className="status-card">

            <div className="card-title">

              <FaTools />

              <h2>
                System Status
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

        {/* SECOND CHART */}

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

            <BarChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis dataKey="id" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="runtime"
                fill="#f97316"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        {/* TABLE */}

        <div className="table-card">

          <div className="card-title">

            <FaMicrochip />

            <h2>
              Latest Monitoring Data
            </h2>

          </div>

          <table>

            <thead>

              <tr>

                <th>ID</th>

                <th>Equipment</th>

                <th>Temperature</th>

                <th>Runtime</th>

                <th>Status</th>

                <th>Date</th>

              </tr>

            </thead>

            <tbody>

              {

                latestData.map((d) => (

                  <tr key={d.id}>

                    <td>
                      #{d.id}
                    </td>

                    <td>
                      {
                        d.equipment?.name
                        || "N/A"
                      }
                    </td>

                    <td>

                      <span
                        className={
                          d.temperature >= 100
                            ? "danger-text"
                            : "normal-text"
                        }
                      >

                        {d.temperature}°C

                      </span>

                    </td>

                    <td>
                      {d.runtime} h
                    </td>

                    <td>

                      {

                        d.temperature >= 100

                          ? (

                            <span className="status critical">
                              Critical
                            </span>

                          )

                          : (

                            <span className="status running">
                              Normal
                            </span>

                          )

                      }

                    </td>

                    <td>

                      {
                        d.date

                          ? new Date(
                              d.date
                            ).toLocaleString()

                          : "-"
                      }

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

export default Dashboard;