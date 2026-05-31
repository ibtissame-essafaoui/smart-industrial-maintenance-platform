import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/Technician/maintenance.css";

function TechnicianMaintenance() {

    // Récupérer le domaine et le nom d'utilisateur depuis le localStorage (stockés après connexion JWT)
    const domain   = localStorage.getItem("domain");
    const username = localStorage.getItem("username");

    const [equipments, setEquipments] = useState([]);

    useEffect(() => {
        loadEquipments();
    }, []);

    const loadEquipments = async () => {

        try {

            const res = await API.get(
                `/equipments/domain/${domain}`
            );

            setEquipments(res.data);

        } catch (err) {

            console.log(err);
        }
    };

    const startMaintenance = async (id) => {

        try {

            await API.put(
                `/maintenance/start/${id}`
            );

            loadEquipments();

        } catch (err) {

            console.log(err);
        }
    };

    const repairEquipment = async (id) => {

        const action = prompt(
            "Action réalisée"
        );

        if (!action) return;

        try {

            await API.post(
                `/maintenance/${id}?action=${action}&technician=${username}`
            );

            loadEquipments();

        } catch (err) {

            console.log(err);
        }
    };

    return (

        <div className="tech-maintenance-page">

            <h1>Maintenance des équipements</h1>

            <div className="tech-maintenance-grid">

                {equipments.map((e) => (

                    <div
                        key={e.id}
                        className="tech-maintenance-card"
                    >

                        <div>

                            <h2>{e.name}</h2>

                            <p className="equipment-type">
                                {e.type}
                            </p>

                            <span className={`status-badge ${e.status?.toLowerCase()}`}>
                                {e.status}
                            </span>

                        </div>

                        <div className="buttons-container">

                            <button
                                className="start-btn"
                                onClick={() => startMaintenance(e.id)}
                            >
                                Start Maintenance
                            </button>

                            <button
                                className="repair-btn"
                                onClick={() => repairEquipment(e.id)}
                            >
                                Finish Maintenance
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default TechnicianMaintenance;