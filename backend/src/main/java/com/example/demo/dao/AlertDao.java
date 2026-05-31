package com.example.demo.dao;

import com.example.demo.entity.Alert;
import com.example.demo.entity.Equipment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertDao
        extends JpaRepository<Alert, Long> {

    List<Alert> findBySeenFalse();

    Alert findTopByEquipmentOrderByDateDesc(
            Equipment equipment
    );

    List<Alert> findAllByOrderByDateDesc();

    List<Alert> findByEquipmentDomain(String domain);
}