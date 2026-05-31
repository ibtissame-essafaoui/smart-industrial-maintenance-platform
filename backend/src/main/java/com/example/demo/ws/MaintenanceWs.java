package com.example.demo.ws;

import com.example.demo.entity.Maintenance;
import com.example.demo.service.MaintenanceService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenance")
@CrossOrigin
public class MaintenanceWs {

    private final MaintenanceService
            maintenanceService;

    public MaintenanceWs(
            MaintenanceService
                    maintenanceService
    ) {

        this.maintenanceService =
                maintenanceService;
    }

    // =========================
    // START
    // =========================

    @PutMapping("/start/{id}")
    public void startMaintenance(
            @PathVariable Long id
    ) {

        maintenanceService
                .startMaintenance(id);
    }

    // =========================
    // PANNE
    // =========================

    @PutMapping("/panne/{id}")
    public void panne(
            @PathVariable Long id
    ) {

        maintenanceService
                .declarePanne(id);
    }

    // =========================
    // REPAIR
    // =========================

    @PostMapping("/{id}")
    public Maintenance repair(

            @PathVariable Long id,

            @RequestParam String action,

            @RequestParam String technician

    ) {

        return maintenanceService
                .repairEquipment(
                        id,
                        action,
                        technician
                );
    }

    // =========================
    // HISTORY
    // =========================

    @GetMapping
    public List<Maintenance> all(){

        return maintenanceService
                .getAll();
    }

    @GetMapping("/domain/{domain}")
    public List<Maintenance>
    getByDomain(
            @PathVariable String domain
    ){
        return maintenanceService
                .getByDomain(domain);
    }
}