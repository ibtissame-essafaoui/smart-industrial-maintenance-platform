package com.example.demo.ws;

import com.example.demo.dto.DataRequest;
import com.example.demo.entity.Data;
import com.example.demo.service.DataService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/data")
public class DataWs {

    private final DataService dataService;

    public DataWs(DataService DataService) {
        this.dataService = DataService;
    }

    @GetMapping
    public List<Data> getAll() {
        return dataService.getAllData();
    }
    @PostMapping
    public Data create(@RequestBody DataRequest request) {
        return dataService.saveDataFromDto(request);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        dataService.deleteData(id);
    }
    @GetMapping("/latest")
    public List<Data> getLatest() {
        return dataService.getLatestData();
    }


    @GetMapping("/equipment/{id}")
    public List<Data> getByEquipment(@PathVariable Long id) {
        return dataService.getDataByEquipment(id);
    }
}