package com.example.demo.dao;

import com.example.demo.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceDao
        extends JpaRepository<Maintenance, Long> {

    List<Maintenance>
    findByEquipmentIdOrderByStartDateDesc(
            Long id
    );

    Maintenance
    findTopByEquipmentIdOrderByStartDateDesc(
            Long id
    );
    List<Maintenance>
    findByEquipmentDomain(String domain);
}