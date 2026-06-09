package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alert")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message;

    private String level;

    private LocalDateTime date;

    private String cause;

    @ManyToOne
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Equipment equipment;

    // =========================
    // READ STATUS
    // =========================

    private boolean seenAdmin = false;

    private boolean seenTechnician = false;

    public Alert() {
    }

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getCause() {
        return cause;
    }

    public void setCause(String cause) {
        this.cause = cause;
    }

    public Equipment getEquipment() {
        return equipment;
    }

    public void setEquipment(Equipment equipment) {
        this.equipment = equipment;
    }

    // =========================
    // ADMIN
    // =========================

    public boolean isSeenAdmin() {
        return seenAdmin;
    }

    public void setSeenAdmin(boolean seenAdmin) {
        this.seenAdmin = seenAdmin;
    }

    // =========================
    // TECHNICIAN
    // =========================

    public boolean isSeenTechnician() {
        return seenTechnician;
    }

    public void setSeenTechnician(boolean seenTechnician) {
        this.seenTechnician = seenTechnician;
    }
}