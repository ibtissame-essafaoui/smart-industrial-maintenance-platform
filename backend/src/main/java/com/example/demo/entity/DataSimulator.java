package com.example.demo.entity;

import com.example.demo.service.DataService;
import com.example.demo.dao.EquipmentDao;
import com.example.demo.dto.DataRequest;
import com.example.demo.entity.Data;
import com.example.demo.entity.Equipment;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataSimulator {

    private final DataService dataService;
    private final EquipmentDao equipmentDao;

    private final Map<Long, Float> temperatureMap = new HashMap<>();
    private final Map<Long, Float> runtimeMap = new HashMap<>();

    private int currentIndex = 0;

    public DataSimulator(DataService dataService, EquipmentDao equipmentDao) {
        this.dataService = dataService;
        this.equipmentDao = equipmentDao;
    }

    @Scheduled(fixedRate = 60000)
    public void generateData() {

        List<Equipment> equipments = equipmentDao.findAll();

        if (equipments.isEmpty()) {
            System.out.println("❌ Aucun équipement");
            return;
        }

        Equipment eq = equipments.get(currentIndex);
        Long eqId = eq.getId();

        temperatureMap.putIfAbsent(eqId, 60f + (float)(Math.random() * 20));
        runtimeMap.putIfAbsent(eqId, 400f + (float)(Math.random() * 600));

        float temp = temperatureMap.get(eqId);
        float runtime = runtimeMap.get(eqId);

        temp += (float)(Math.random() * 4 - 2);
        runtime += (float)(Math.random() * 30);

        if (temp < 50) temp = 50;
        if (temp > 110) temp = 110;

        temperatureMap.put(eqId, temp);
        runtimeMap.put(eqId, runtime);

        DataRequest request = new DataRequest();
        request.setTemperature(temp);
        request.setRuntime(runtime);
        request.setEquipmentId(eqId);

        try {

            Data saved = dataService.saveDataFromDto(request);

            if (saved != null) {
                System.out.println("✅ DATA SAVED → ID: " + eqId +
                        " Temp=" + temp +
                        " Runtime=" + runtime);
            } else {
                System.out.println("⏳ SKIPPED → ID: " + eqId);
            }

        } catch (Exception e) {
            System.out.println("❌ ERROR → " + e.getMessage());
        }

        currentIndex++;
        if (currentIndex >= equipments.size()) {
            currentIndex = 0;
        }
    }
}