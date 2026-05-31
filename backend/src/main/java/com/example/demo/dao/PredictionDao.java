package com.example.demo.dao;

import com.example.demo.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PredictionDao extends JpaRepository<Prediction, Long> {
    List<Prediction> findTop10ByOrderByDateDesc();
}