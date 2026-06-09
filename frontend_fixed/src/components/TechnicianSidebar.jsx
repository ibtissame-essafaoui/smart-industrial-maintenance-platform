import React, {
  useEffect,
  useState
} from "react";

import {
  Link,
  useLocation
} from "react-router-dom";

import {
  FaTools,
  FaSignOutAlt,
  FaMicrochip,
  FaBell,
  FaHistory,
  FaBrain 
} from "react-icons/fa";

import API from "../services/api";

function TechnicianSidebar() {

  const location =
    useLocation();

  // Récupérer le domaine du technicien depuis le localStorage (stocké après connexion)
  const domain = localStorage.getItem("domain");

  // =====================
  // NOTIFICATIONS
  // =====================

  const [
    notifCount,
    setNotifCount
  ] = useState(0);

  // =====================
  // LOAD ALERTS COUNT
  // =====================

const loadNotifications =
  async () => {

    try {
const res =
  await API.get(
    `/alerts/technician/count-unread/${domain}`
  );

      setNotifCount(
        res.data
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =====================
  // AUTO REFRESH
  // =====================

  useEffect(() => {

  loadNotifications();

  const interval =
    setInterval(() => {

      loadNotifications();

    }, 2000);

  return () =>
    clearInterval(interval);

}, [location.pathname]);

  // =====================
  // ACTIVE LINK
  // =====================

  const isActive = (path) => {

    return location.pathname === path

      ? "sidebar-link active"

      : "sidebar-link";
  };

  // =====================
  // LOGOUT
  // =====================

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
          Espace Technicien
        </h2>

        <p className="logo-sub">
          Plateforme de Maintenance
        </p>

      </div>

      {/* MENU */}

      <div className="sidebar-menu">

        {/* EQUIPMENTS */}

        <Link
          to="/technician"
          className={
            isActive("/technician")
          }
        >

          <FaMicrochip />

          <span>
            Mes Équipements
          </span>

        </Link>

        {/* MAINTENANCE */}

        <Link
          to="/technician-maintenance"
          className={
            isActive(
              "/technician-maintenance"
            )
          }
        >

          <FaTools />

          <span>
            Maintenance
          </span>

        </Link>

        {/* ALERTS */}

        <Link
          to="/technician/alerts"
          className={
            isActive(
              "/technician/alerts"
            )
          }
        >

          <div
            style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              width:"100%"
            }}
          >

            <div
              style={{
                display:"flex",
                alignItems:"center",
                gap:"14px"
              }}
            >

              <FaBell />

              <span>
                Alertes
              </span>

            </div>

            {
              notifCount > 0 && (

                <div
                  style={{
                    background:"#ef4444",
                    color:"white",
                    minWidth:"24px",
                    height:"24px",
                    borderRadius:"50%",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontSize:"12px",
                    fontWeight:"700"
                  }}
                >

                  {notifCount}

                </div>
              )
            }

          </div>

        </Link>

        <Link
  to="/technician-predictions"
  className={isActive("/technician-predictions")}
>
  <FaBrain />
  <span>Prédictions IA</span>
</Link>

        {/* HISTORY */}

        <Link
          to="/technician-history"
          className={
            isActive(
              "/technician-history"
            )
          }
        >

          <FaHistory />

          <span>
            Historique
          </span>

        </Link>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
        >

          <span className="logout-content">

            <FaSignOutAlt />

            Déconnexion

          </span>

        </button>

      </div>

    </div>
  );
}

export default TechnicianSidebar;