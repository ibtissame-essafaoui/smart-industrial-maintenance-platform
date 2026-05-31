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

    public AlertWs(
            AlertService alertService
    ) {

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
    public Alert getById(
            @PathVariable Long id
    ) {

        return alertService.getById(id);
    }

    // =====================================
    // GET UNREAD ALERTS
    // =====================================

    @GetMapping("/unread")
    public List<Alert> getUnread() {

        return alertService.getUnreadAlerts();
    }

    // =====================================
    // COUNT UNREAD
    // =====================================

    @GetMapping("/count-unread")
    public int countUnread() {

        return alertService.countUnread();
    }

    // =====================================
    // MARK ALL AS READ
    // =====================================

    // ✅ MARK ONE ALERT AS READ

    // ALERT WS

    @PutMapping("/read/{id}")
    public void markAsRead(
            @PathVariable Long id){

        alertService.markAsRead(id);
    }

    @GetMapping("/domain/{domain}")
    public List<Alert> getByDomain(
            @PathVariable String domain
    ){
        return alertService
                .getAlertsByDomain(domain);
    }
}