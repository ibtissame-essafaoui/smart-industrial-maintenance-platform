import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

/* ADMIN */

import Dashboard
from "./pages/admin/Dashboard";

import Equipments
from "./pages/admin/Equipments";

import AddEquipment
from "./pages/admin/AddEquipment";

import Alerts
from "./pages/admin/Alerts";

import AlertDetails
from "./pages/admin/AlertDetails";

import PredictionPage
from "./pages/admin/PredictionPage";

import MaintenanceHistoryPage
from "./pages/admin/MaintenanceHistoryPage";

import UsersPage
from "./pages/admin/UsersPage";

/* TECHNICIAN */

import TechnicianDashboard
from "./pages/technician/TechnicianDashboard";

import TechnicianMaintenance
from "./pages/technician/TechnicianMaintenance";

import TechnicianHistory
from "./pages/technician/TechnicianHistory";

import TechnicianAlerts
from "./pages/technician/TechnicianAlerts";

import TechnicianAlertDetails
from "./pages/technician/TechnicianAlertDetails";

import TechnicianPredictions
from "./pages/technician/TechnicianPredictions";

/* LOGIN */

import Login
from "./pages/Login";

/* SIDEBARS */

import Sidebar
from "./components/Sidebar";

import TechnicianSidebar
from "./components/TechnicianSidebar";

/* STYLES */

import "./styles/Admin/sidebar.css";

// ─── COMPOSANT DE ROUTE PROTÉGÉE ─────────────────────────────────────────────
// Redirige vers /login si l'utilisateur n'est pas authentifié.
// Si un rôle est requis, vérifie aussi que l'utilisateur possède ce rôle.
function PrivateRoute({ children, requiredRole }) {

  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  // Pas de token → redirection vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Rôle insuffisant → redirection vers la page de connexion
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppContent() {

  const location = useLocation();

  // Lire le token et le rôle depuis le localStorage (stockés après connexion)
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

  // La sidebar est masquée sur la page de connexion
  const isLoginPage = location.pathname === "/login";

  return (

    <div
      style={{
        display: "flex",
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >

      {/* SIDEBAR : affichée seulement si l'utilisateur est connecté */}

      {!isLoginPage && token && (
        role === "ADMIN"
          ? <Sidebar />
          : <TechnicianSidebar />
      )}

      {/* CONTENU PRINCIPAL */}

      <div className="main-content">

        <Routes>

          {/* PAGE DE CONNEXION : accessible à tous */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* ─── ROUTES ADMIN (rôle ADMIN requis) ─── */}

          <Route
            path="/"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/equipments"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <Equipments />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-equipment"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AddEquipment />
              </PrivateRoute>
            }
          />

          <Route
            path="/alerts"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <Alerts />
              </PrivateRoute>
            }
          />

          <Route
            path="/alerts/:id"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AlertDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/predictions"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <PredictionPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/maintenance-history"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <MaintenanceHistoryPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <UsersPage />
              </PrivateRoute>
            }
          />

          {/* ─── ROUTES TECHNICIEN (rôle TECHNICIEN requis) ─── */}

          <Route
            path="/technician"
            element={
              <PrivateRoute requiredRole="TECHNICIEN">
                <TechnicianDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/technician-maintenance"
            element={
              <PrivateRoute requiredRole="TECHNICIEN">
                <TechnicianMaintenance />
              </PrivateRoute>
            }
          />

          <Route
            path="/technician-history"
            element={
              <PrivateRoute requiredRole="TECHNICIEN">
                <TechnicianHistory />
              </PrivateRoute>
            }
          />

          <Route
            path="/technician/alerts"
            element={
              <PrivateRoute requiredRole="TECHNICIEN">
                <TechnicianAlerts />
              </PrivateRoute>
            }
          />

          <Route
            path="/technician/alerts/:id"
            element={
              <PrivateRoute requiredRole="TECHNICIEN">
                <TechnicianAlertDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/technician-predictions"
            element={
              <PrivateRoute requiredRole="TECHNICIEN">
                <TechnicianPredictions />
              </PrivateRoute>
            }
          />

          {/* Route par défaut : redirection vers /login */}

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>

      </div>

    </div>
  );
}

function App() {

  return (

    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
