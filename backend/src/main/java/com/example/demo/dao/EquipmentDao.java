package com.example.demo.dao;

import com.example.demo.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentDao
        extends JpaRepository<Equipment, Long> {

    List<Equipment> findByDomain(String domain);

}