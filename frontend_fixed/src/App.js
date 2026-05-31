import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
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

function AppContent() {

  const location =
    useLocation();

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  // =====================
  // HIDE SIDEBAR LOGIN
  // =====================

  const isLoginPage =

    location.pathname ===
    "/login";

  return (

    <div
      style={{

        display:"flex",

        background:"#f8fafc",

        minHeight:"100vh"
      }}
    >

      {/* SIDEBAR */}

      {
        !isLoginPage && user && (

          user.role === "ADMIN"

          ?

          <Sidebar />

          :

          <TechnicianSidebar />

        )
      }

      {/* CONTENT */}

      <div className="main-content">

        <Routes>

          {/* LOGIN */}

          <Route
            path="/login"
            element={<Login />}
          />

          {/* ADMIN */}

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/equipments"
            element={<Equipments />}
          />

          <Route
            path="/add-equipment"
            element={<AddEquipment />}
          />

          <Route
            path="/alerts"
            element={<Alerts />}
          />

          <Route
            path="/alerts/:id"
            element={<AlertDetails />}
          />

          <Route
            path="/predictions"
            element={<PredictionPage />}
          />

          <Route
            path="/maintenance-history"
            element={
              <MaintenanceHistoryPage />
            }
          />

          <Route
            path="/users"
            element={<UsersPage />}
          />

          {/* TECHNICIAN */}

          <Route
            path="/technician"
            element={
              <TechnicianDashboard />
            }
          />
          <Route
  path="/technician-maintenance"
  element={
    <TechnicianMaintenance />
  }
/>


<Route
  path="/technician-history"
  element={
    <TechnicianHistory />
  }
/>


<Route
  path="/technician/alerts"
  element={<TechnicianAlerts />}
/>

<Route
  path="/technician/alerts/:id"
  element={<TechnicianAlertDetails />}
/>

<Route
  path="/technician-predictions"
  element={<TechnicianPredictions />}
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