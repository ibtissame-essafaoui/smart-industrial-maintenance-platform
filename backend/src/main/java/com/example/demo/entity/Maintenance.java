package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;

    private String technician;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Long durationMinutes;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    // =========================
    // GETTERS / SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTechnician() {
        return technician;
    }

    public void setTechnician(String technician) {
        this.technician = technician;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(
            LocalDateTime startDate
    ) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(
            LocalDateTime endDate
    ) {
        this.endDate = endDate;
    }

    public Long getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(
            Long durationMinutes
    ) {
        this.durationMinutes =
                durationMinutes;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(
            Equipment equipment
    ) {
        this.equipment = equipment;
    }
}