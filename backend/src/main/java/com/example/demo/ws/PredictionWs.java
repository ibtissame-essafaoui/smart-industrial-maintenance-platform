package com.example.demo.ws;

import com.example.demo.entity.Prediction;
import com.example.demo.dao.PredictionDao;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/predictions")
@CrossOrigin
public class PredictionWs {

    private final PredictionDao predictionDao;

    public PredictionWs(PredictionDao predictionDao) {
        this.predictionDao = predictionDao;
    }

    @GetMapping
    public List<Prediction> getAll() {
        return predictionDao.findAll();
    }
    @GetMapping("/latest")
    public List<Prediction> getLatest() {
        return predictionDao.findTop10ByOrderByDateDesc();
    }

    @GetMapping("/predictions/domain/{domain}")
    public List<Prediction> getPredictionsByDomain(
            @PathVariable String domain) {

        return predictionDao.findAll()
                .stream()
                .filter(prediction ->

                        prediction.getEquipment() != null

                                &&

                                prediction.getEquipment()
                                        .getDomain()
                                        .equalsIgnoreCase(domain)

                )
                .toList();
    }
    @GetMapping("/predictions")
    public List<Prediction> getAllPredictions(){
        return predictionDao.findAll();
    }
}