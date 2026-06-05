package com.example.demo.ws;

import com.example.demo.dao.EquipmentDao;
import com.example.demo.dao.PredictionDao;
import com.example.demo.entity.Equipment;
import com.example.demo.entity.Prediction;

import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/predictions")
@CrossOrigin
public class PredictionWs {

    private final PredictionDao predictionDao;
    private final EquipmentDao equipmentDao;

    public PredictionWs(
            PredictionDao predictionDao,
            EquipmentDao equipmentDao
    ) {
        this.predictionDao = predictionDao;
        this.equipmentDao = equipmentDao;
    }

    @GetMapping
    public List<Prediction> getAll() {
        return predictionDao.findAll();
    }

    @GetMapping("/latest")
    public List<Prediction> getLatestPredictionPerEquipment() {

        List<Prediction> result =
                new ArrayList<>();

        List<Equipment> equipments =
                equipmentDao.findAll();

        for (Equipment equipment : equipments) {

            Prediction prediction =
                    predictionDao
                            .findTopByEquipmentIdOrderByDateDesc(
                                    equipment.getId()
                            );

            if (prediction != null) {
                result.add(prediction);
            }
        }

        return result;
    }

    @GetMapping("/domain/{domain}")
    public List<Prediction> getByDomain(
            @PathVariable String domain
    ) {

        return predictionDao.findByEquipmentDomain(
                domain
        );
    }
}
