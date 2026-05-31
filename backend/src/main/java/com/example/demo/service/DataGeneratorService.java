package com.example.demo.service;

import com.example.demo.dao.EquipmentDao;
import com.example.demo.dto.DataRequest;
import com.example.demo.entity.Equipment;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class DataGeneratorService {

    private final EquipmentDao equipmentDao;
    private final DataService dataService;

    private final Random random = new Random();

    public DataGeneratorService(EquipmentDao equipmentDao,
                                DataService dataService) {

        this.equipmentDao = equipmentDao;
        this.dataService = dataService;
    }

    // every 1 minute

    @Scheduled(fixedRate = 60000)
    public void generateData() {

        List<Equipment> equipments =
                equipmentDao.findAll();

        for (Equipment equipment : equipments) {

            DataRequest request = new DataRequest();

            // 10% anomalies

            float temperature;

            if (random.nextInt(100) < 10) {

                temperature =
                        90 + random.nextFloat() * 30;

            } else {

                temperature =
                        40 + random.nextFloat() * 30;
            }

            float runtime =
                    500 + random.nextFloat() * 2500;

            request.setTemperature(temperature);
            request.setRuntime(runtime);
            request.setEquipmentId(equipment.getId());

            dataService.saveDataFromDto(request);

            System.out.println(
                    "✅ Data generated for: "
                            + equipment.getName()
            );
        }
    }
}