import React, { useState } from "react";
import API from "../../services/api";

import {
  FaMicrochip,
  FaSave
} from "react-icons/fa";

function AddEquipment() {

  const [equipment, setEquipment] = useState({

    name: "",
    type: "POMPE",
    status: "ACTIF"

  });

  const handleChange = (e) => {

    setEquipment({

      ...equipment,

      [e.target.name]: e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/equipments",
        equipment
      );

      alert("✅ Equipment Added");

      setEquipment({

        name: "",
        type: "POMPE",
        status: "ACTIF"

      });

    } catch (err) {

      console.log(err);

      alert("❌ Error");

    }

  };

  return (

    <div className="add-equipment-page">

      <div className="form-card">

        <div className="form-header">

          <FaMicrochip className="header-icon" />

          <div>

            <h1>Add Equipment</h1>

            <p>
              Create new industrial equipment
            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="form-group">

            <label>
              Equipment Name
            </label>

            <input
              type="text"
              name="name"
              value={equipment.name}
              onChange={handleChange}
              placeholder="Pompe A"
              required
            />

          </div>

          {/* TYPE */}

          <div className="form-group">

            <label>
              Equipment Type
            </label>

            <select
              name="type"
              value={equipment.type}
              onChange={handleChange}
            >

              <option value="POMPE">
                Pompe
              </option>

              <option value="COMPRESSEUR">
                Compresseur
              </option>

              <option value="CONVOYEUR">
                Convoyeur
              </option>

              <option value="BROYEUR">
                Broyeur
              </option>

              <option value="FOUR_INDUSTRIEL">
                Four industriel
              </option>

              <option value="ECHANGEUR_THERMIQUE">
                Échangeur thermique
              </option>

              <option value="VENTILATEUR">
                Ventilateur
              </option>

              <option value="RESERVOIR">
                Réservoir
              </option>

              <option value="TURBINE">
                Turbine
              </option>

              <option value="MOTEUR_ELECTRIQUE">
                Moteur électrique
              </option>

            </select>

          </div>

          {/* STATUS */}

          <div className="form-group">

            <label>
              Status
            </label>

            <select
              name="status"
              value={equipment.status}
              onChange={handleChange}
            >

              <option value="ACTIF">
                Actif
              </option>

              <option value="EN_PANNE">
                En panne
              </option>

              <option value="EN_MAINTENANCE">
                En maintenance
              </option>

              <option value="ARRET_PROGRAMME">
                Arrêt programmé
              </option>

              <option value="HORS_SERVICE">
                Hors service
              </option>

              <option value="EN_INSPECTION">
                En inspection
              </option>

            </select>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="save-btn"
          >

            <FaSave />

            Save Equipment

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddEquipment;