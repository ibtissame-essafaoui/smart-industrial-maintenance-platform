package com.example.demo.ws;

import com.example.demo.entity.Equipment;
import com.example.demo.entity.EquipmentStatus;
import com.example.demo.entity.EquipmentType;
import com.example.demo.service.EquipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/equipments")
public class EquipmentWs {

    private final EquipmentService equipmentService;

    public EquipmentWs(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    // ✅ GET ALL
    @GetMapping
    public List<Equipment> getAll() {
        return equipmentService.getAllEquipments();
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public Equipment getById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id);
    }

    // ✅ CREATE
    @PostMapping
    public Equipment create(@RequestBody Equipment equipment) {
        return equipmentService.saveEquipment(equipment);
    }

    @PutMapping("/{id}")

    public Equipment update(

            @PathVariable Long id,

            @RequestBody Equipment equipment

    ) {

        return equipmentService
                .updateEquipment(
                        id,
                        equipment
                );
    }
    // ✅ DELETE
    @DeleteMapping("/equipments/{id}")
    public void deleteEquipment(
            @PathVariable Long id
    ) {
        equipmentService.deleteEquipment(id);
    }

    // 🔥 BONUS : TYPES (à ajouter ici)

    @GetMapping("/types")
    public List<Map<String, String>> getTypes() {
        return Arrays.stream(EquipmentType.values())
                .map(t -> Map.of(
                        "value", t.name(),
                        "label", t.getLabel()
                ))
                .toList();
    }

    // 🔥 BONUS : STATUS (aussi utile)
    @GetMapping("/status")
    public List<Map<String, String>> getStatus() {
        return Arrays.stream(EquipmentStatus.values())
                .map(s -> Map.of(
                        "value", s.name(),
                        "label", s.getLabel()
                ))
                .toList();
    }

    @GetMapping("/with-data")
    public List<Map<String, Object>>
    getEquipmentsWithData() {

        return equipmentService
                .getEquipmentsWithLatestData();
    }

    // =====================
// GET BY DOMAIN
// =====================

    @GetMapping("/domain/{domain}")
    public List<Equipment>
    getByDomain(@PathVariable String domain){

        return equipmentService
                .getEquipmentsByDomain(domain);
    }



}