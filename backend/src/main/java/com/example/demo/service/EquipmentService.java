package com.example.demo.service;

import com.example.demo.dao.DataDao;
import com.example.demo.dao.EquipmentDao;
import com.example.demo.entity.Data;
import com.example.demo.entity.Equipment;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class EquipmentService {

    private final EquipmentDao equipmentDao;
    private final DataDao dataDao;
    public EquipmentService(EquipmentDao equipmentDao, DataDao dataDao) {
        this.equipmentDao = equipmentDao;
        this.dataDao = dataDao;
    }

    // ✅ GET ALL
    public List<Equipment> getAllEquipments() {
        return equipmentDao.findAll();
    }

    // ✅ GET BY ID
    public Equipment getEquipmentById(Long id) {
        return equipmentDao.findById(id).orElse(null);
    }

    // ✅ UPDATE

    public Equipment updateEquipment(

            Long id,
            Equipment updatedEquipment

    ) {

        Equipment equipment =
                equipmentDao.findById(id)
                        .orElseThrow();

        equipment.setName(
                updatedEquipment.getName()
        );

        equipment.setType(
                updatedEquipment.getType()
        );

        equipment.setStatus(
                updatedEquipment.getStatus()
        );

        return equipmentDao.save(
                equipment
        );
    }

    // ✅ CREATE / UPDATE
    public Equipment saveEquipment(Equipment equipment) {
        return equipmentDao.save(equipment);
    }
/// GET BY DOMAIN

public List<Equipment>
getEquipmentsByDomain(String domain){

    return equipmentDao.findByDomain(domain);
}
    // ✅ DELETE
    @Transactional
    public void deleteEquipment(Long id) {

        Equipment equipment =
                equipmentDao.findById(id)
                        .orElseThrow();

        equipmentDao.delete(equipment);
    }
    public List<Map<String, Object>>
    getEquipmentsWithLatestData() {

        List<Equipment> equipments =
                equipmentDao.findAll();

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Equipment eq : equipments) {

            Map<String, Object> map =
                    new HashMap<>();

            map.put("id", eq.getId());

            map.put("name", eq.getName());

            map.put("domain", eq.getDomain());

            map.put("type", eq.getType());

            map.put("status", eq.getStatus());

            Data latestData =
                    dataDao.findTopByEquipmentIdOrderByDateDesc(
                            eq.getId()
                    );

            if (latestData != null) {

                map.put(
                        "temperature",
                        latestData.getTemperature()
                );

                map.put(
                        "runtime",
                        latestData.getRuntime()
                );

                map.put(
                        "vibration",
                        latestData.getVibration()
                );

                map.put(
                        "pressure",
                        latestData.getPressure()
                );

                map.put(
                        "humidity",
                        latestData.getHumidity()
                );

                map.put(
                        "currentValue",
                        latestData.getCurrentValue()
                );

                map.put(
                        "voltage",
                        latestData.getVoltage()
                );

            } else {

                map.put("temperature", 0);
                map.put("runtime", 0);
                map.put("vibration", 0);
                map.put("pressure", 0);
                map.put("humidity", 0);
                map.put("currentValue", 0);
                map.put("voltage", 0);
            }
            result.add(map);
        }

        return result;
    }

}