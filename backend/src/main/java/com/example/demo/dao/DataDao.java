package com.example.demo.dao;

import com.example.demo.entity.Data;
import com.example.demo.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
public interface DataDao extends JpaRepository<Data, Long> {
    List<Data> findTop20ByOrderByDateDesc();
    List<Data> findByDateAfter(LocalDateTime date);
    Data findTopByEquipmentIdOrderByDateDesc(
            Long equipmentId
    );
    Data findTopByEquipmentOrderByDateDesc(
            Equipment equipment
    );
    List<Data> findByEquipmentId(Long equipmentId);
}