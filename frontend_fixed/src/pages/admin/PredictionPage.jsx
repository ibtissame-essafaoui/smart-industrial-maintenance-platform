import React, { useEffect, useState } from "react";

import API from "../../services/api";
import Sidebar from "../../components/Sidebar";

import {
  FaBrain,
  FaMicrochip,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTools,
} from "react-icons/fa";

import "../../styles/Admin/predictions.css";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getCardClass = (result) => {
  if (!result) return "success";

  const value = result.toUpperCase();
  if (value.includes("PANNE")) return "danger";
  if (value.includes("RISQUE")) return "warning";
  return "success";
};

const getStatusText = (result) => {
  if (!result) return "Fonctionnement normal";

  const value = result.toUpperCase();
  if (value.includes("PANNE")) return "Panne critique imminente";
  if (value.includes("RISQUE")) return "Risque élevé détecté";
  return "Fonctionnement normal";
};

const getIcon = (result) => {
  if (!result) return <FaCheckCircle />;

  const value = result.toUpperCase();
  if (value.includes("PANNE")) return <FaTimesCircle />;
  if (value.includes("RISQUE")) return <FaExclamationTriangle />;
  return <FaCheckCircle />;
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

function StatsGrid({ predictions }) {
  const count = (keyword) =>
    predictions.filter((p) =>
      p.result?.toUpperCase().includes(keyword)
    ).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Total Predictions</h3>
        <p>{predictions.length}</p>
      </div>

      <div className="stat-card danger">
        <h3>Pannes critiques</h3>
        <p>{count("PANNE")}</p>
      </div>

      <div className="stat-card warning">
        <h3>Risques détectés</h3>
        <p>{count("RISQUE")}</p>
      </div>

      <div className="stat-card success">
        <h3>Fonctionnement normal</h3>
        <p>{count("OK")}</p>
      </div>
    </div>
  );
}


function PredictionCard({ item }) {
  const cardClass = getCardClass(item.result);

  return (
    <div className={`prediction-card ${cardClass}`}>
      {/* Top */}
      <div className="prediction-top">
        <div className={`prediction-icon ${cardClass}`}>
          {getIcon(item.result)}
        </div>
        <h2 className={`prediction-title status-${cardClass}`}>
          {getStatusText(item.result)}
        </h2>
      </div>

      {/* Info */}
      <div className="prediction-info">
        <p className="equipment-name">
          <FaMicrochip /> {item.equipment?.name}
        </p>

        <h4>Probabilité : {Math.round(item.probability * 100)}%</h4>

        <div className="progress-bar">
          <div
            className={`progress-fill ${cardClass}`}
            style={{ width: `${item.probability * 100}%` }}
          />
        </div>

        <div className="prediction-detail">
          <h5>Cause :</h5>
          <p>{item.cause || "Aucune cause détectée"}</p>
        </div>

        <div className="prediction-detail">
          <h5>
            <FaTools /> Solution :
          </h5>
          <p>{item.solution || "Aucune solution recommandée"}</p>
        </div>

        <span className="prediction-date">
          {new Date(item.date).toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function Filters({ search, setSearch, statusFilter, setStatusFilter, domainFilter, setDomainFilter }) {
  return (
    <div className="prediction-filters">
  <h3>🔍 Recherche et Filtres</h3>

  <input
    type="text"
    placeholder="Rechercher un équipement..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="ALL">Tous les états</option>
    <option value="OK">🟢 OK</option>
    <option value="RISQUE">🟠 Risque</option>
    <option value="PANNE">🔴 Panne</option>
  </select>

  <select
    value={domainFilter}
    onChange={(e) => setDomainFilter(e.target.value)}
  >
    <option value="ALL">🏭 Tous les domaines</option>
    <option value="Mining">Mining</option>
    <option value="Chimie">Chimie</option>
    <option value="Energie">Energie</option>
    <option value="Traitement">Traitement</option>
  </select>
</div>
  );
}


// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

function PredictionPage() {
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [domainFilter, setDomainFilter] = useState("ALL");

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      const res = await API.get("/predictions/latest");
      setPredictions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredPredictions = predictions.filter((item) => {
    const equipmentName = item.equipment?.name?.toLowerCase() || "";
    const domain = item.equipment?.domain?.toLowerCase() || "";
    const result = item.result?.toUpperCase() || "";

    const matchSearch = equipmentName.includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "ALL" ? true : result.includes(statusFilter);
    const matchDomain =
      domainFilter === "ALL"
        ? true
        : domain === domainFilter.toLowerCase();

    return matchSearch && matchStatus && matchDomain;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="prediction-page">
        {/* Header */}
        <div className="prediction-header">
          <FaBrain className="brain-icon" />
          <div>
            <h1>Intelligence Artificielle</h1>
            <p>Analyse prédictive industrielle</p>
          </div>
        </div>

        {/* Filters */}
        <Filters
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          domainFilter={domainFilter}
          setDomainFilter={setDomainFilter}
        />

        {/* Stats */}
        <StatsGrid predictions={predictions} />

        {/* Prediction cards */}
        <div className="prediction-grid">
          {filteredPredictions.map((item) => (
            <PredictionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PredictionPage;