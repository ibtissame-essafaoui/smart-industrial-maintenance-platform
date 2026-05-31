import React, {
  useEffect,
  useState
} from "react";

import API
from "../../services/api";

import "../../styles/Technician/technician.css";

function TechnicianDashboard() {

  // ======================
  // USER
  // ======================

  // Récupérer le domaine et le nom d'utilisateur depuis le localStorage (stockés après connexion JWT)
  const domain   = localStorage.getItem("domain");
  const username = localStorage.getItem("username");

  // ======================
  // STATES
  // ======================

  const [
    equipments,
    setEquipments
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  // ======================
  // LOAD DATA
  // ======================

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const res =
            await API.get(

              `/equipments/domain/${domain}`

            );

          setEquipments(
            res.data
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, [domain]);

  // ======================
  // COUNTERS
  // ======================

  const totalEquipments =
    equipments.length;

  const activeEquipments =
    equipments.filter(
      (e) =>
        e.status ===
        "ACTIF"
    ).length;

  const maintenanceEquipments =
    equipments.filter(
      (e) =>
        e.status ===
        "EN_MAINTENANCE"
    ).length;

  const brokenEquipments =
    equipments.filter(
      (e) =>
        e.status ===
        "EN_PANNE"
    ).length;

  return (

    <div className="tech-dashboard">

      {/* HEADER */}

      <div className="tech-header">

        <div>

          <h1>
           Bienvenue {username}
          </h1>

          <p>
            Domaine :
            {" "}
            {domain}
          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">

          <h3>
           Équipements
          </h3>

          <span>
            {totalEquipments}
          </span>

        </div>

        <div className="stat-card">

          <h3>
            Actifs
          </h3>

          <span>
            {activeEquipments}
          </span>

        </div>

        <div className="stat-card">

          <h3>
            Maintenance
          </h3>

          <span>
            {maintenanceEquipments}
          </span>

        </div>

        <div className="stat-card">

          <h3>
            En panne
          </h3>

          <span>
            {brokenEquipments}
          </span>

        </div>

      </div>

      {/* TITLE */}

      <h2 className="section-title">

       Mes Équipements

      </h2>

      {/* CONTENT */}

      {
        loading ? (

          <div className="empty-box">

            <h3>
             Chargement...
            </h3>

          </div>

        ) : equipments.length === 0 ? (

          <div className="empty-box">

            <h3>
              Aucun équipement trouvé
            </h3>

            <p>
              Aucun équipement dans votre domaine
            </p>

          </div>

        ) : (

          <div className="tech-cards">

            {
              equipments.map(
                (e) => (

                  <div
                    key={e.id}
                    className="tech-card"
                  >

                    <div
                      className={
                        `status-dot ${e.status}`
                      }
                    ></div>

                    <h2>
                      {e.name}
                    </h2>

                    <p>
                      Type :
                      {" "}
                      {e.type}
                    </p>

                    <span
                      className={
                        `status-badge ${e.status}`
                      }
                    >
                      {e.status}
                    </span>

                  </div>
                )
              )
            }

          </div>
        )
      }

    </div>
  );
}

export default TechnicianDashboard;