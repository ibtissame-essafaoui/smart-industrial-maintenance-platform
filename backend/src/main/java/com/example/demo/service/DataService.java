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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DataService {

    private final DataDao dataDao;
    private final EquipmentDao equipmentDao;
    private final AlertDao alertDao;
    private final PredictionDao predictionDao;

    private final RestTemplate restTemplate = new RestTemplate();

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

    public Data saveDataFromDto(DataRequest request) {

        try {

            if (request.getEquipmentId() == null) {
                System.out.println("❌ Equipment ID NULL");
                return null;
            }

            Equipment equipment =
                    equipmentDao.findById(request.getEquipmentId())
                            .orElse(null);

            if (equipment == null) {
                System.out.println("❌ Equipment Not Found");
                return null;
            }

            Data data = new Data();

            data.setTemperature(request.getTemperature());
            data.setRuntime(request.getRuntime());

            data.setVibration((double) request.getVibration());
            data.setPressure((double) request.getPressure());
            data.setHumidity((double) request.getHumidity());
            data.setCurrentValue((double) request.getCurrentValue());
            data.setVoltage((double) request.getVoltage());

            data.setDate(LocalDateTime.now());

            data.setEquipment(equipment);

            Data savedData =
                    dataDao.saveAndFlush(data);

            System.out.println(
                    "✅ DATA SAVED -> ID = "
                            + savedData.getId()
            );

            callAI(savedData, equipment);

            return savedData;

        } catch (Exception e) {

            System.out.println("❌ ERROR SAVE DATA");
            e.printStackTrace();

            return null;
        }
    }

    // =====================================================
    // IA CALL
    // =====================================================

    private void callAI(
            Data data,
            Equipment equipment
    ) {

        try {

            System.out.println("🚀 Calling AI...");

            Map<String, Object> request =
                    new HashMap<>();

            request.put("temperature", data.getTemperature());
            request.put("runtime", data.getRuntime());
            request.put("vibration", data.getVibration());
            request.put("pressure", data.getPressure());
            request.put("humidity", data.getHumidity());
            request.put("currentValue", data.getCurrentValue());
            request.put("voltage", data.getVoltage());

            Map response =
                    restTemplate.postForObject(
                            "http://127.0.0.1:5000/predict",
                            request,
                            Map.class
                    );

            if (response == null) {

                System.out.println("⚠️ AI Response NULL");
                return;
            }

            String result =
                    String.valueOf(
                            response.getOrDefault(
                                    "prediction",
                                    "OK"
                            )
                    );

            float probability = 0f;

            if (response.get("probability") != null) {

                probability =
                        Float.parseFloat(
                                response.get("probability")
                                        .toString()
                        );
            }

            String cause =
                    String.valueOf(
                            response.getOrDefault(
                                    "cause",
                                    ""
                            )
                    );

            String solution =
                    String.valueOf(
                            response.getOrDefault(
                                    "solution",
                                    ""
                            )
                    );

            // =====================================
            // SAVE PREDICTION
            // =====================================

            Prediction prediction =
                    new Prediction();

            prediction.setResult(result);
            prediction.setProbability(probability);
            prediction.setCause(cause);
            prediction.setSolution(solution);
            prediction.setDate(LocalDateTime.now());
            prediction.setEquipment(equipment);

            predictionDao.saveAndFlush(prediction);

            System.out.println(
                    "🔮 Prediction Saved -> "
                            + result
            );

            // =====================================
            // CREATE ALERT
            // =====================================

            if ("PANNE".equalsIgnoreCase(result)) {

                Alert alert = new Alert();

                alert.setMessage(
                        "Panne détectée sur l'équipement : "
                                + equipment.getName()
                );

                alert.setLevel("CRITICAL");
                alert.setCause(cause);
                alert.setDate(LocalDateTime.now());
                alert.setEquipment(equipment);
                alert.setSeen(false);

                alertDao.saveAndFlush(alert);

                System.out.println(
                        "🚨 Alert Saved -> PANNE"
                );
            }
            else {

                System.out.println(
                        "✅ No Alert Created -> "
                                + result
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "⚠️ AI ERROR"
            );

            e.printStackTrace();
        }
    }

    // =====================================================
    // GETTERS
    // =====================================================

    public List<Data> getAllData() {
        return dataDao.findAll();
    }

    public List<Data> getLatestData() {
        return dataDao.findTop20ByOrderByDateDesc();
    }

    public List<Data> getDataByEquipment(Long id) {
        return dataDao.findByEquipmentId(id);
    }

    public void deleteData(Long id) {
        dataDao.deleteById(id);
    }
}