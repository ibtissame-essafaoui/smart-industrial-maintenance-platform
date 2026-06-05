package com.example.demo.service;

import com.example.demo.dto.DataRequest;
import com.example.demo.entity.Equipment;
import com.example.demo.dao.EquipmentDao;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class DataGeneratorService {

    private final EquipmentDao equipmentDao;
    private final DataService dataService;

    private final Random random = new Random();

    public DataGeneratorService(
            EquipmentDao equipmentDao,
            DataService dataService
    ) {
        this.equipmentDao = equipmentDao;
        this.dataService = dataService;
    }

    @Scheduled(fixedRate = 3600000)
    public void generateData() {

        System.out.println("GENERATING DATA -> "
                + java.time.LocalDateTime.now());

        List<Equipment> equipments =
                equipmentDao.findAll();

        for (Equipment eq : equipments) {

            DataRequest req =
                    new DataRequest();

            float temperature =
                    (random.nextInt(100) < 10)
                            ? 90 + random.nextFloat() * 40
                            : 40 + random.nextFloat() * 35;

            float runtime =
                    500 + random.nextFloat() * 3000;

            float vibration =
                    random.nextFloat() * 8;

            float pressure =
                    2 + random.nextFloat() * 5;

            float humidity =
                    30 + random.nextFloat() * 60;

            float current =
                    10 + random.nextFloat() * 40;

            float voltage =
                    370 + random.nextFloat() * 60;

            req.setTemperature(temperature);
            req.setRuntime(runtime);
            req.setVibration(vibration);
            req.setPressure(pressure);
            req.setHumidity(humidity);
            req.setCurrentValue(current);
            req.setVoltage(voltage);
            req.setEquipmentId(eq.getId());

            dataService.saveDataFromDto(req);
        }
    }
}
