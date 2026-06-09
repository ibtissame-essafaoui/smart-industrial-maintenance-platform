package com.example.demo.ws;

import com.example.demo.entity.Alert;
import com.example.demo.service.AlertService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/alerts")
public class AlertWs {

    private final AlertService alertService;

    public AlertWs(AlertService alertService) {
        this.alertService = alertService;
    }

    // =====================================
    // GET ALL ALERTS
    // =====================================

    @GetMapping
    public List<Alert> getAll() {
        return alertService.getAllAlerts();
    }

    // =====================================
    // GET ALERT BY ID
    // =====================================

    @GetMapping("/{id}")
    public Alert getById(@PathVariable Long id) {
        return alertService.getById(id);
    }

    // =====================================
    // ADMIN
    // =====================================

    @GetMapping("/admin/unread")
    public List<Alert> getUnreadAdmin() {
        return alertService.getUnreadAlertsAdmin();
    }

    @GetMapping("/admin/count-unread")
    public int countUnreadAdmin() {
        return alertService.countUnreadAdmin();
    }

    @PutMapping("/admin/read/{id}")
    public void markAsReadAdmin(@PathVariable Long id) {
        alertService.markAsReadAdmin(id);
    }

    @PutMapping("/admin/read-all")
    public void markAllAsReadAdmin() {
        alertService.markAllAsReadAdmin();
    }

    // =====================================
    // TECHNICIAN
    // =====================================

    @GetMapping("/technician/unread")
    public List<Alert> getUnreadTechnician() {
        return alertService.getUnreadAlertsTechnician();
    }

    @GetMapping("/technician/count-unread/{domain}")
    public int countUnreadTechnician(
            @PathVariable String domain
    ) {
        return alertService.countUnreadTechnician(
                domain
        );
    }

    @PutMapping("/technician/read/{id}")
    public void markAsReadTechnician(@PathVariable Long id) {
        alertService.markAsReadTechnician(id);
    }

    @PutMapping("/technician/read-all")
    public void markAllAsReadTechnician() {
        alertService.markAllAsReadTechnician();
    }

    // =====================================
    // FILTER BY DOMAIN
    // =====================================

    @GetMapping("/domain/{domain}")
    public List<Alert> getByDomain(
            @PathVariable String domain
    ) {
        return alertService.getAlertsByDomain(domain);
    }

    // =====================================
    // DELETE ALERT
    // =====================================

    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
    }
}