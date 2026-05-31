package com.example.demo.service;

import com.example.demo.dao.AlertDao;
import com.example.demo.dao.DataDao;
import com.example.demo.dao.EquipmentDao;
import com.example.demo.dao.PredictionDao;

import com.example.demo.dto.DataRequest;

import com.example.demo.entity.Alert;
import com.example.demo.entity.Data;
import com.example.demo.entity.Equipment;
import com.example.demo.entity.Prediction;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DataService {

    private final DataDao dataDao;
    private final EquipmentDao equipmentDao;
    private final AlertDao alertDao;
    private final PredictionDao predictionDao;

    private final RestTemplate restTemplate =
            new RestTemplate();

    public DataService(
            DataDao dataDao,
            EquipmentDao equipmentDao,
            AlertDao alertDao,
            PredictionDao predictionDao
    ) {

        this.dataDao = dataDao;
        this.equipmentDao = equipmentDao;
        this.alertDao = alertDao;
        this.predictionDao = predictionDao;
    }

    // =====================================================
    // SAVE DATA
    // =====================================================

    public Data saveDataFromDto(
            DataRequest request
    ) {

        try {

            // =====================================================
            // CHECK EQUIPMENT
            // =====================================================

            if (request.getEquipmentId() == null) {

                throw new RuntimeException(
                        "Equipment ID required"
                );
            }

            Equipment equipment =
                    equipmentDao.findById(
                                    request.getEquipmentId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Equipment not found"
                                    )
                            );

            // =====================================================
            // SAVE ONLY EVERY 1 HOUR
            // =====================================================

            Data lastData =
                    dataDao.findTopByEquipmentOrderByDateDesc(
                            equipment
                    );

            if (
                    lastData != null
                            &&
                            lastData.getDate() != null
            ) {

                long hours =
                        ChronoUnit.HOURS.between(
                                lastData.getDate(),
                                LocalDateTime.now()
                        );

                if (hours < 1) {

                    System.out.println(
                            "⏳ WAIT 1 HOUR"
                    );

                    return null;
                }
            }

            // =====================================================
            // CREATE DATA
            // =====================================================

            Data data = new Data();

            data.setTemperature(
                    request.getTemperature()
            );

            data.setRuntime(
                    request.getRuntime()
            );

            data.setDate(
                    LocalDateTime.now()
            );

            data.setEquipment(
                    equipment
            );

            // =====================================================
            // SAVE DATA
            // =====================================================

            Data savedData =
                    dataDao.saveAndFlush(data);

            System.out.println(
                    "✅ DATA SAVED : "
                            + savedData.getId()
            );

            // =====================================================
            // CALL IA
            // =====================================================

            callAI(
                    savedData.getTemperature(),
                    savedData.getRuntime(),
                    equipment
            );

            return savedData;

        } catch (Exception e) {

            System.out.println(
                    "❌ ERROR SAVE DATA"
            );

            e.printStackTrace();

            return null;
        }
    }

    // =====================================================
    // IA CALL
    // =====================================================

    private void callAI(
            float temp,
            float runtime,
            Equipment equipment
    ) {

        try {

            System.out.println(
                    "🚀 CALLING FLASK..."
            );

            Map<String, Object> request =
                    new HashMap<>();

            request.put(
                    "temperature",
                    temp
            );

            request.put(
                    "runtime",
                    runtime
            );

            // =====================================================
            // CALL FLASK
            // =====================================================

            Map response =
                    restTemplate.postForObject(
                            "http://127.0.0.1:5000/predict",
                            request,
                            Map.class
                    );

            // =====================================================
            // CHECK RESPONSE
            // =====================================================

            if (
                    response == null
                            ||
                            response.get("prediction")
                                    == null
            ) {

                return;
            }

            // =====================================================
            // RESULT
            // =====================================================

            String result =
                    response.get("prediction")
                            .toString();

            // =====================================================
            // PROBABILITY
            // =====================================================

            float probability = 0.0f;

            if (
                    response.get("probability")
                            != null
            ) {

                probability =
                        Float.parseFloat(
                                response.get(
                                        "probability"
                                ).toString()
                        );
            }

            // =====================================================
            // CAUSE
            // =====================================================

            String cause = "";

            if (
                    response.get("cause")
                            != null
            ) {

                cause =
                        response.get("cause")
                                .toString();
            }

            // =====================================================
            // SOLUTION
            // =====================================================

            String solution = "";

            if (
                    response.get("solution")
                            != null
            ) {

                solution =
                        response.get("solution")
                                .toString();
            }

            // =====================================================
            // SAVE PREDICTION
            // =====================================================

            createPrediction(
                    result,
                    probability,
                    cause,
                    solution,
                    equipment
            );

            // =====================================================
            // ALERT ONLY IF PANNE
            if (result.equalsIgnoreCase("PANNE")) {

                String message;
                String level;

                if (temp >= 105) {

                    message = "Température critique détectée";
                    level = "CRITICAL";

                } else if (runtime >= 2200) {

                    message = "Durée excessive de fonctionnement";
                    level = "HIGH";

                } else {

                    message = "Panne critique détectée";
                    level = "CRITICAL";
                }

                createAlert(
                        message,
                        level,
                        equipment,
                        cause
                );
            }

            System.out.println(
                    "🤖 IA RESULT : "
                            + result
            );

        } catch (Exception e) {

            System.out.println(
                    "⚠️ IA ERROR"
            );

            e.printStackTrace();
        }
    }

    // =====================================================
    // CREATE ALERT
    // =====================================================

    private void createAlert(
            String message,
            String level,
            Equipment equipment,
            String cause
    ) {

        try {

            Alert lastAlert =
                    alertDao
                            .findTopByEquipmentOrderByDateDesc(
                                    equipment
                            );

            // =====================================================
            // ANTI SPAM 1 HOUR
            // =====================================================

            if (
                    lastAlert != null
                            &&
                            lastAlert.getDate() != null
            ) {

                long hours =
                        ChronoUnit.HOURS.between(
                                lastAlert.getDate(),
                                LocalDateTime.now()
                        );

                if (
                        hours < 1
                                &&
                                lastAlert.getMessage()
                                        .equals(message)
                ) {

                    System.out.println(
                            "⛔ ALERT BLOCKED"
                    );

                    return;
                }
            }

            Alert alert = new Alert();

            alert.setMessage(message);

            alert.setLevel(level);

            alert.setDate(
                    LocalDateTime.now()
            );

            alert.setEquipment(
                    equipment
            );

            alert.setCause(cause);

            alert.setSeen(false);

            alertDao.saveAndFlush(alert);

            System.out.println(
                    "🚨 ALERT SAVED"
            );

        } catch (Exception e) {

            System.out.println(
                    "❌ ERROR ALERT"
            );

            e.printStackTrace();
        }
    }

    // =====================================================
    // CREATE PREDICTION
    // =====================================================

    private void createPrediction(
            String result,
            float probability,
            String cause,
            String solution,
            Equipment equipment
    ) {

        try {

            Prediction prediction =
                    new Prediction();

            prediction.setResult(result);

            prediction.setProbability(
                    probability
            );

            prediction.setCause(cause);

            prediction.setSolution(solution);

            prediction.setDate(
                    LocalDateTime.now()
            );

            prediction.setEquipment(
                    equipment
            );

            predictionDao.saveAndFlush(
                    prediction
            );

            System.out.println(
                    "🔮 PREDICTION SAVED"
            );

        } catch (Exception e) {

            System.out.println(
                    "❌ ERROR PREDICTION"
            );

            e.printStackTrace();
        }
    }

    // =====================================================
    // GET ALL DATA
    // =====================================================

    public List<Data> getAllData() {

        return dataDao.findAll();
    }

    // =====================================================
    // GET LATEST DATA
    // =====================================================

    public List<Data> getLatestData() {

        return dataDao
                .findTop20ByOrderByDateDesc();
    }

    // =====================================================
    // GET DATA BY EQUIPMENT
    // =====================================================

    public List<Data> getDataByEquipment(
            Long id
    ) {

        return dataDao.findByEquipmentId(id);
    }

    // =====================================================
    // DELETE DATA
    // =====================================================

    public void deleteData(Long id) {

        dataDao.deleteById(id);
    }
}