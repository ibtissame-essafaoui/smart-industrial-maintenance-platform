package com.example.demo.entity;

public enum EquipmentStatus {

    ACTIF("Actif"),
    EN_PANNE("En panne"),
    EN_MAINTENANCE("En maintenance"),
    ARRET_PROGRAMME("Arrêt programmé"),
    HORS_SERVICE("Hors service"),
    EN_INSPECTION("En inspection");

    private final String label;

    EquipmentStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}