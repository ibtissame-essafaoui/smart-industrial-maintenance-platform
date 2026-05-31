package com.example.demo.service;

import com.example.demo.dao.EquipmentDao;
import com.example.demo.dao.MaintenanceDao;

import com.example.demo.entity.Equipment;
import com.example.demo.entity.EquipmentStatus;
import com.example.demo.entity.Maintenance;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceDao maintenanceDao;
    private final EquipmentDao equipmentDao;

    public MaintenanceService(
            MaintenanceDao maintenanceDao,
            EquipmentDao equipmentDao
    ) {

        this.maintenanceDao =
                maintenanceDao;

        this.equipmentDao =
                equipmentDao;
    }

    // =====================================================
    // START MAINTENANCE
    // =====================================================

    public void startMaintenance(
            Long equipmentId
    ) {

        try {

            Equipment equipment =
                    equipmentDao.findById(
                            equipmentId
                    ).orElseThrow();

            // =====================================================
            // CHECK IF MAINTENANCE ALREADY EXISTS
            // =====================================================

            Maintenance existing =
                    maintenanceDao
                            .findTopByEquipmentIdOrderByStartDateDesc(
                                    equipmentId
                            );

            // إذا كانت maintenance مازال مفتوحة
            if (
                    existing != null
                            &&
                            existing.getEndDate() == null
            ) {

                System.out.println(
                        "⚠️ Maintenance already started"
                );

                return;
            }

            // =====================================================
            // UPDATE EQUIPMENT STATUS
            // =====================================================

            equipment.setStatus(
                    EquipmentStatus.EN_MAINTENANCE
            );

            equipmentDao.save(
                    equipment
            );

            // =====================================================
            // CREATE NEW MAINTENANCE
            // =====================================================

            Maintenance maintenance =
                    new Maintenance();

            maintenance.setEquipment(
                    equipment
            );

            maintenance.setStartDate(
                    LocalDateTime.now()
            );

            maintenance.setAction(
                    "Maintenance démarrée"
            );

            maintenance.setTechnician(
                    "N/A"
            );

            maintenanceDao.save(
                    maintenance
            );

            System.out.println(
                    "✅ Maintenance started"
            );

        } catch (Exception e) {

            System.out.println(
                    "❌ ERROR START MAINTENANCE"
            );

            e.printStackTrace();
        }
    }

    // =====================================================
    // DECLARE PANNE
    // =====================================================

    public void declarePanne(
            Long equipmentId
    ) {

        try {

            Equipment equipment =
                    equipmentDao.findById(
                            equipmentId
                    ).orElseThrow();

            equipment.setStatus(
                    EquipmentStatus.EN_PANNE
            );

            equipmentDao.save(
                    equipment
            );

            System.out.println(
                    "⚠️ Equipment declared PANNE"
            );

        } catch (Exception e) {

            System.out.println(
                    "❌ ERROR DECLARE PANNE"
            );

            e.printStackTrace();
        }
    }

    // =====================================================
    // REPAIR EQUIPMENT
    // =====================================================

    public Maintenance repairEquipment(

            Long equipmentId,
            String action,
            String technician

    ) {

        try {

            Equipment equipment =
                    equipmentDao.findById(
                            equipmentId
                    ).orElseThrow();

            // =====================================================
            // GET LAST MAINTENANCE
            // =====================================================

            Maintenance maintenance =
                    maintenanceDao
                            .findTopByEquipmentIdOrderByStartDateDesc(
                                    equipmentId
                            );

            if (maintenance == null) {

                throw new RuntimeException(
                        "No maintenance found"
                );
            }

            // =====================================================
            // UPDATE MAINTENANCE
            // =====================================================

            maintenance.setAction(
                    action
            );

            maintenance.setTechnician(
                    technician
            );

            maintenance.setEndDate(
                    LocalDateTime.now()
            );

            // =====================================================
            // CALCULATE DURATION
            // =====================================================

            long duration =
                    ChronoUnit.MINUTES.between(

                            maintenance.getStartDate(),

                            maintenance.getEndDate()
                    );

            maintenance.setDurationMinutes(
                    duration
            );

            // =====================================================
            // EQUIPMENT ACTIVE
            // =====================================================

            equipment.setStatus(
                    EquipmentStatus.ACTIF
            );

            equipmentDao.save(
                    equipment
            );

            // =====================================================
            // SAVE
            // =====================================================

            Maintenance saved =
                    maintenanceDao.save(
                            maintenance
                    );

            System.out.println(
                    "✅ Equipment repaired"
            );

            return saved;

        } catch (Exception e) {

            System.out.println(
                    "❌ ERROR REPAIR"
            );

            e.printStackTrace();

            return null;
        }
    }

    // =====================================================
    // GET HISTORY BY EQUIPMENT
    // =====================================================

    public List<Maintenance>
    getByEquipment(Long id){

        return maintenanceDao
                .findByEquipmentIdOrderByStartDateDesc(
                        id
                );
    }

    // =====================================================
    // GET ALL HISTORY
    // =====================================================

    public List<Maintenance>
    getAll(){

        return maintenanceDao
                .findAll();
    }

    // =====================================================
    // GET BY DOMAIN
    // =====================================================

    public List<Maintenance>
    getByDomain(String domain){

        return maintenanceDao
                .findByEquipmentDomain(
                        domain
                );
    }
}