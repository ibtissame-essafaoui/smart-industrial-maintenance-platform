package com.example.demo.entity;


public enum EquipmentType {

    POMPE("Pompe"),
    COMPRESSEUR("Compresseur"),
    CONVOYEUR("Convoyeur"),
    BROYEUR("Broyeur"),
    FOUR_INDUSTRIEL("Four industriel"),
    ECHANGEUR_THERMIQUE("Échangeur thermique"),
    VENTILATEUR("Ventilateur"),
    RESERVOIR("Réservoir"),
    TURBINE("Turbine"),
    MOTEUR_ELECTRIQUE("Moteur électrique");

    private final String label;

    EquipmentType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}