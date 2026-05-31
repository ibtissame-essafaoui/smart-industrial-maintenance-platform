import React, { useEffect, useState } from "react";

import {
  FaChartLine,
  FaMicrochip,
  FaBell,
  FaBrain,
  FaPlusCircle,
  FaTools,
  FaSignOutAlt,
  FaUsers
} from "react-icons/fa";

import {
  Link,
  useLocation
} from "react-router-dom";

import API from "../services/api";

function Sidebar() {

  const location =
    useLocation();

  // =========================
  // NOTIFICATIONS COUNT
  // =========================

  const [notifCount,
    setNotifCount] =
    useState(0);

  // =========================
  // LOAD ALERTS COUNT
  // =========================

  const loadNotifications =
    async () => {

      try {

        const res =
          await API.get(
            "/alerts/count-unread"
          );

        setNotifCount(res.data);

      } catch (err) {

        console.log(err);
      }
    };

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {

    loadNotifications();

    const interval =
      setInterval(() => {

        loadNotifications();

      }, 2000);

    return () =>
      clearInterval(interval);

  }, []);

  // =========================
  // ACTIVE LINK
  // =========================

  const isActive = (path) => {

    return location.pathname === path
      ? "sidebar-link active"
      : "sidebar-link";
  };  


  // Supprime le token JWT et toutes les données de session, puis redirige
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("domain");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (

    <div className="sidebar">

      {/* LOGO */}

      <div className="logo-section">

        <img
          src="/ocp.png"
          alt="OCP"
          className="logo-image"
        />

        <h2 className="logo-title">
          OCP Smart
        </h2>

        <p className="logo-sub">
          AI Maintenance Platform
        </p>

      </div>

      {/* MENU */}

      <div className="sidebar-menu">

        {/* DASHBOARD */}

        <Link
          to="/"
          className={isActive("/")}
        >

          <FaChartLine />

          <span>
            Dashboard
          </span>

        </Link>

        {/* EQUIPMENTS */}

        <Link
          to="/equipments"
          className={isActive("/equipments")}
        >

          <FaMicrochip />

          <span>
            Equipments
          </span>

        </Link>

        {/* ADD EQUIPMENT */}

        <Link
          to="/add-equipment"
          className={isActive("/add-equipment")}
        >

          <FaPlusCircle />

          <span>
            Add Equipment
          </span>

        </Link>

        {/* ALERTS */}

        <Link
          to="/alerts"
          className={isActive("/alerts")}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%"
            }}
          >

            {/* LEFT */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >

              <FaBell />

              <span>
                Alerts
              </span>

            </div>

            {/* BADGE */}

            {
              notifCount > 0 && (

                <div
                  style={{
                    background: "#ef4444",
                    color: "white",
                    minWidth: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "700",
                    padding: "0 6px",
                    boxShadow:
                      "0 4px 10px rgba(239,68,68,0.4)"
                  }}
                >

                  {notifCount}

                </div>
              )
            }

          </div>

        </Link>

        {/* AI PREDICTIONS */}

        <Link
          to="/predictions"
          className={isActive("/predictions")}
        >

          <FaBrain />

          <span>
            AI Predictions
          </span>

        </Link>

        {/* MAINTENANCE */}

        <Link
         to="/maintenance-history"
          className={isActive("/maintenance")}
        >

          <FaTools />

          <span>
             Maintenance History
          </span>
          
        </Link>
        <Link
  to="/users"
  className={isActive("/users")}
>

  <FaUsers />

  <span>
    Users
  </span>

</Link>
        
       <button
  className="logout-btn"
  onClick={logout}
>

  <span className="logout-content">

    <FaSignOutAlt />

    <span>
      Logout
    </span>

  </span>

</button>

      </div>

    </div>
    
    
  );
}

export default Sidebar;