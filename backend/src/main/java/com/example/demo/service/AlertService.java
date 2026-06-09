package com.example.demo.service;

import com.example.demo.dao.AlertDao;
import com.example.demo.entity.Alert;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlertService {

    private final AlertDao alertDao;

    public AlertService(AlertDao alertDao) {
        this.alertDao = alertDao;
    }

    // =====================================
    // GET ALL ALERTS
    // =====================================

    public List<Alert> getAllAlerts() {
        return alertDao.findAllByOrderByDateDesc();
    }

    // =====================================
    // GET ALERT BY ID
    // =====================================

    public Alert getById(Long id) {

        return alertDao.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Alert not found"));
    }

    // =====================================
    // ADMIN ALERTS
    // =====================================

    public List<Alert> getUnreadAlertsAdmin() {
        return alertDao.findBySeenAdminFalse();
    }

    public int countUnreadAdmin() {
        return alertDao.findBySeenAdminFalse().size();
    }

    public void markAsReadAdmin(Long id) {

        Alert alert = getById(id);

        alert.setSeenAdmin(true);

        alertDao.save(alert);
    }

    public void markAllAsReadAdmin() {

        List<Alert> alerts =
                alertDao.findBySeenAdminFalse();

        alerts.forEach(alert ->
                alert.setSeenAdmin(true));

        alertDao.saveAll(alerts);
    }

    // =====================================
    // TECHNICIAN ALERTS
    // =====================================

    public List<Alert> getUnreadAlertsTechnician() {
        return alertDao.findBySeenTechnicianFalse();
    }

    public int countUnreadTechnician() {
        return alertDao.findBySeenTechnicianFalse().size();
    }

    public void markAsReadTechnician(Long id) {

        Alert alert = getById(id);

        alert.setSeenTechnician(true);

        alertDao.save(alert);
    }

    public void markAllAsReadTechnician() {

        List<Alert> alerts =
                alertDao.findBySeenTechnicianFalse();

        alerts.forEach(alert ->
                alert.setSeenTechnician(true));

        alertDao.saveAll(alerts);
    }

    // =====================================
    // DELETE ALERT
    // =====================================

    public void deleteAlert(Long id) {

        Alert alert = getById(id);

        alertDao.delete(alert);
    }

    // =====================================
    // FILTER BY DOMAIN
    // =====================================

    public List<Alert> getAlertsByDomain(String domain) {

        return alertDao.findByEquipmentDomain(domain);
    }
    public int countUnreadTechnician(String domain) {

        return (int)
                alertDao
                        .countBySeenTechnicianFalseAndEquipmentDomain(
                                domain
                        );
    }
}