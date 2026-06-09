import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

import {
  FaMicrochip,
  FaTools,
  FaEdit,
  FaTrash,
  FaThermometerHalf,
} from "react-icons/fa";

import "../../styles/Admin/equipement.css";

function Equipments() {
  const [equipments, setEquipments] = useState([]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    type: "",
    status: "",
  });

  useEffect(() => {
    loadEquipments();
  }, []);

  const loadEquipments = async () => {
    try {
      const res = await API.get("/equipments/with-data");

      setEquipments(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(err);
      alert("Erreur chargement équipements");
    }
  };

  const deleteEquipment = async (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cet équipement ?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/equipments/${id}`);

      setEquipments(
        equipments.filter(
          (eq) => eq.id !== id
        )
      );

      alert("Equipement supprimé avec succès");
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data ||
          "Erreur suppression équipement"
      );
    }
  };

  const editEquipment = (equipment) => {
    setEditingId(equipment.id);

    setEditData({
      name: equipment.name || "",
      type: equipment.type || "",
      status: equipment.status || "",
    });
  };

  const saveEdit = async () => {
    try {
      await API.put(
        `/equipments/${editingId}`,
        editData
      );

      alert("Equipement modifié");

      setEditingId(null);

      loadEquipments();
    } catch (err) {
      console.error(err);
      alert("Erreur modification");
    }
  };

  const filteredEquipments =
    equipments.filter((eq) => {
      const keyword =
        search.toLowerCase();

      return (
        eq.name
          ?.toLowerCase()
          .includes(keyword) ||
        eq.type
          ?.toLowerCase()
          .includes(keyword) ||
        eq.status
          ?.toLowerCase()
          .includes(keyword) ||
        eq.domaine
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  const getTypeLabel = (type) => {
    switch (type) {
      case "POMPE":
        return "Pompe";

      case "COMPRESSEUR":
        return "Compresseur";

      case "CONVOYEUR":
        return "Convoyeur";

      case "BROYEUR":
        return "Broyeur";

      case "FOUR_INDUSTRIEL":
        return "Four Industriel";

      case "ECHANGEUR_THERMIQUE":
        return "Échangeur Thermique";

      case "VENTILATEUR":
        return "Ventilateur";

      case "RESERVOIR":
        return "Réservoir";

      case "TURBINE":
        return "Turbine";

      default:
        return "Moteur";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIF":
        return "status running";

      case "EN_MAINTENANCE":
        return "status maintenance";

      case "EN_PANNE":
        return "status critical";

      case "EN_INSPECTION":
        return "status inspection";

      default:
        return "status stopped";
    }
  };

  const totalEquipments =
    equipments.length;

  const maintenanceCount =
    equipments.filter(
      (eq) =>
        eq.status ===
        "EN_MAINTENANCE"
    ).length;

  const criticalCount =
    equipments.filter(
      (eq) =>
        eq.status === "EN_PANNE"
    ).length;

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-content">
        <div className="page-header">
          <div>
            <h1>
              Equipments Management
            </h1>

            <p>
              Industrial Machines Monitoring
            </p>
          </div>
        </div>

        <div className="equipment-stats">
          <div className="equipment-stat-card">
            <FaMicrochip className="stat-icon blue" />

            <div>
              <span>
                Total Equipments
              </span>

              <h2>
                {totalEquipments}
              </h2>
            </div>
          </div>

          <div className="equipment-stat-card">
            <FaTools className="stat-icon orange" />

            <div>
              <span>
                Maintenance Needed
              </span>

              <h2>
                {maintenanceCount}
              </h2>
            </div>
          </div>

          <div className="equipment-stat-card">
            <FaThermometerHalf className="stat-icon red" />

            <div>
              <span>
                Critical Equipments
              </span>

              <h2>
                {criticalCount}
              </h2>
            </div>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search equipment..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div className="equipment-table-card">
          <div className="table-header">
            <h2>
              Equipments List
            </h2>

            <Link
              to="/add-equipment"
              className="add-btn"
            >
              + Add Equipment
            </Link>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Domain</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEquipments.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign:
                          "center",
                      }}
                    >
                      Aucun équipement
                    </td>
                  </tr>
                ) : (
                  filteredEquipments.map(
                    (eq) => (
                      <tr key={eq.id}>
                        <td>
                          #{eq.id}
                        </td>

                        <td>
                          {eq.name}
                        </td>

                        <td>
                          <span className="domain-badge">
                            {eq.domain ||
                              "N/A"}
                          </span>
                        </td>

                        <td>
                          <span className="type-badge">
                            {getTypeLabel(
                              eq.type
                            )}
                          </span>
                        </td>

                        <td>
                          <span
                            className={getStatusClass(
                              eq.status
                            )}
                          >
                            {eq.status}
                          </span>
                        </td>

                        <td className="action-buttons">
                          <button
                            className="icon-btn edit-btn"
                            onClick={() =>
                              editEquipment(
                                eq
                              )
                            }
                          >
                            <FaEdit />
                          </button>

                          <button
                            className="icon-btn delete-btn"
                            onClick={() =>
                              deleteEquipment(
                                eq.id
                              )
                            }
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editingId && (
          <div className="modal">
            <div className="modal-content">
              <h2>
                Modifier équipement
              </h2>

              <input
                type="text"
                placeholder="Nom"
                value={editData.name}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
              />

              <select
                value={editData.status}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    status:
                      e.target.value,
                  })
                }
              >
                <option value="ACTIF">
                  ACTIF
                </option>

                <option value="EN_MAINTENANCE">
                  EN_MAINTENANCE
                </option>

                <option value="EN_PANNE">
                  EN_PANNE
                </option>

                <option value="EN_INSPECTION">
                  EN_INSPECTION
                </option>
              </select>

              <div className="modal-buttons">
                <button
                  className="save-btn"
                  onClick={saveEdit}
                >
                  Sauvegarder
                </button>

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setEditingId(null)
                  }
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Equipments;