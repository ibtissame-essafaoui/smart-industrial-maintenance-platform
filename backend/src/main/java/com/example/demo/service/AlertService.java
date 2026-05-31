package com.example.demo.service;

import com.example.demo.dao.AlertDao;
import com.example.demo.entity.Alert;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertDao alertDao;

    public AlertService(
            AlertDao alertDao
    ) {

        this.alertDao = alertDao;
    }

    // =====================================
    // GET ALL ALERTS
    // =====================================

    public List<Alert> getAllAlerts() {

        return alertDao
                .findAllByOrderByDateDesc();
    }

    // =====================================
    // GET ALERT BY ID
    // =====================================

    public Alert getById(Long id) {

        return alertDao
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Alert not found"
                        )
                );
    }

    // =====================================
    // GET UNREAD ALERTS
    // =====================================

    public List<Alert> getUnreadAlerts() {

        return alertDao.findBySeenFalse();
    }

    // =====================================
    // COUNT UNREAD ALERTS
    // =====================================

    public int countUnread() {

        return alertDao
                .findBySeenFalse()
                .size();
    }

    // =====================================
    // MARK ALERT AS READ
    // =====================================

    public void markAsRead(Long id) {

        Alert alert =
                alertDao.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Alert not found"
                                )
                        );

        alert.setSeen(true);

        alertDao.save(alert);
    }

    // =====================================
    // MARK ALL ALERTS AS READ
    // =====================================

    public void markAllAsRead() {

        List<Alert> alerts =
                alertDao.findBySeenFalse();

        for (Alert alert : alerts) {

            alert.setSeen(true);
        }

        alertDao.saveAll(alerts);
    }

    // =====================================
    // DELETE ALERT
    // =====================================

    public void deleteAlert(Long id) {

        Alert alert =
                alertDao.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Alert not found"
                                )
                        );

        alertDao.delete(alert);
    }
    public List<Alert> getAlertsByDomain(String domain){

        return alertDao.findByEquipmentDomain(domain);
    }
}