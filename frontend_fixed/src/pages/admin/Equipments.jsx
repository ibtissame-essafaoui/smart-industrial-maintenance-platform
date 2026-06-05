import React, {
  useEffect,
  useState
} from "react";

import API from "../../services/api";

import { Link } from "react-router-dom";

import Sidebar from "../../components/Sidebar";

import {
  FaMicrochip,
  FaTools,
  FaEdit, 
  FaTrash,
  FaThermometerHalf
} from "react-icons/fa";

import "../../styles/Admin/dashboard.css";

function Equipments() {

  // =====================================
  // STATES
  // =====================================

  const [equipments, setEquipments] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({

      name: "",
      type: "",
      status: ""

    });

  // =====================================
  // LOAD EQUIPMENTS
  // =====================================

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

      alert(
        "Erreur chargement équipements"
      );
    }
  };

  // =====================================
  // DELETE EQUIPMENT
  // =====================================

  const deleteEquipment =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Supprimer équipement ?"
        );

      if (!confirmDelete)
        return;

      try {

        await API.delete(
          `/equipments/${id}`
        );

        // UPDATE LOCAL STATE

        setEquipments(

          equipments.filter(
            (eq) => eq.id !== id
          )

        );

        alert(
          "Equipement supprimé"
        );

      } catch (err) {

        console.log(err);

        alert(
          err?.response?.data
          ||
          "Erreur suppression équipement"
        );
      }
    };

  // =====================================
  // EDIT EQUIPMENT
  // =====================================

  const editEquipment = (eq) => {

    setEditingId(eq.id);

    setEditData({

      name: eq.name,
      type: eq.type,
      status: eq.status

    });
  };

  // =====================================
  // SAVE EDIT
  // =====================================

  const saveEdit = async () => {

    try {

      await API.put(

        `/equipments/${editingId}`,

        editData

      );

      setEditingId(null);

      loadEquipments();

      alert(
        "Equipement modifié"
      );

    } catch (err) {

      console.log(err);

      alert(
        "Erreur modification"
      );
    }
  };

  // =====================================
  // SEARCH FILTER
  // =====================================

  const filteredEquipments =
    equipments.filter((eq) => {

      const keyword =
        search.toLowerCase();

      return (

        eq.name?.toLowerCase()
          .includes(keyword)

        ||

        eq.type?.toLowerCase()
          .includes(keyword)

        ||

        eq.status?.toLowerCase()
          .includes(keyword)

        ||

        String(eq.temperature || 0)
          .includes(keyword)

        ||

        String(eq.runtime || 0)
          .includes(keyword)

      );

    });

  // =====================================
  // TYPE LABEL
  // =====================================

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
        return "Four industriel";

      case "ECHANGEUR_THERMIQUE":
        return "Échangeur thermique";

      case "VENTILATEUR":
        return "Ventilateur";

      case "RESERVOIR":
        return "Réservoir";

      case "TURBINE":
        return "Turbine";

      default:
        return "Moteur électrique";
    }
  };

  // =====================================
  // STATUS CLASS
  // =====================================

  const getStatusClass = (status) => {

    switch (status) {

      case "ACTIF":
        return "status running";

      case "EN_MAINTENANCE":
        return "status maintenance";

      case "EN_PANNE":
        return "status critical";

      default:
        return "status stopped";
    }
  };

  // =====================================
  // RENDER
  // =====================================

  return (

    <div className="admin-layout">

      {/* SIDEBAR */}

      <Sidebar />

      {/* PAGE */}

      <div className="admin-content">

        {/* HEADER */}

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

        {/* STATS */}

        <div className="equipment-stats">

          {/* TOTAL */}

          <div className="equipment-stat-card">

            <FaMicrochip
              className="stat-icon blue"
            />

            <div>

              <span>
                Total Equipments
              </span>

              <h2>
                {equipments.length}
              </h2>

            </div>

          </div>

          {/* MAINTENANCE */}

          <div className="equipment-stat-card">

            <FaTools
              className="stat-icon orange"
            />

            <div>

              <span>
                Maintenance Needed
              </span>

              <h2>

                {
                  equipments.filter(
                    e =>
                      e.status ===
                      "EN_MAINTENANCE"
                  ).length
                }

              </h2>

            </div>

          </div>

          {/* CRITICAL */}

          <div className="equipment-stat-card">

            <FaThermometerHalf
              className="stat-icon red"
            />

            <div>

              <span>
                Critical Equipments
              </span>

              <h2>

                {
                  equipments.filter(
                    e =>
                      e.temperature > 90
                  ).length
                }

              </h2>

            </div>

          </div>

        </div>

        {/* SEARCH */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Search by name, type, status..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* TABLE */}

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

                  <th>Type</th>

                  <th>Status</th>

                  <th>Temperature</th>

                  <th>Runtime</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {
                  filteredEquipments.map(
                    (eq) => (

                      <tr key={eq.id}>

                        {/* ID */}

                        <td>
                          #{eq.id}
                        </td>

                        {/* NAME */}

                        <td>
                          {eq.name}
                        </td>

                        {/* TYPE */}

                        <td>

                          <span
                            className="type-badge"
                          >

                            {
                              getTypeLabel(eq.type)
                            }

                          </span>

                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={
                              getStatusClass(
                                eq.status
                              )
                            }
                          >

                            {eq.status}

                          </span>

                        </td>

                        {/* TEMP */}

                        <td>

                          {eq.temperature || 0}
                          °C

                        </td>

                        {/* RUNTIME */}

                        <td>

                          {eq.runtime || 0}
                          h

                        </td>

{/* ACTIONS */}

<td className="action-buttons">

  <button
    className="icon-btn edit-btn"
    onClick={() => editEquipment(eq)}
    title="Modifier"
  >
    <FaEdit />
  </button>

  <button
    className="icon-btn delete-btn"
    onClick={() => deleteEquipment(eq.id)}
    title="Supprimer"
  >
    <FaTrash />
  </button>

</td>

                      </tr>

                    ))
                }

              </tbody>

            </table>

          </div>

        </div>

        {/* MODAL */}

        {
          editingId && (

            <div className="modal">

              <div className="modal-content">

                <h2>
                  Modifier équipement
                </h2>

                {/* NAME */}

                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>

                    setEditData({

                      ...editData,
                      name: e.target.value

                    })

                  }
                />

                {/* STATUS */}

                <select
                  value={editData.status}
                  onChange={(e) =>

                    setEditData({

                      ...editData,
                      status: e.target.value

                    })

                  }
                >

                  <option value="ACTIF">
                    ACTIF
                  </option>

                  <option value="EN_PANNE">
                    EN_PANNE
                  </option>

                  <option value="EN_MAINTENANCE">
                    EN_MAINTENANCE
                  </option>

                  <option value="EN_INSPECTION">
                    EN_INSPECTION
                  </option>

                </select>

                {/* BUTTONS */}

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

          )
        }

      </div>

    </div>
  );
}

export default Equipments;