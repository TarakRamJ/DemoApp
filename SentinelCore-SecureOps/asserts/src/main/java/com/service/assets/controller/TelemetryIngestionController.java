package com.service.assets.controller;

import com.service.assets.model.PerformanceMetric;
import com.service.assets.service.InfrastructureMonitoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/telemetry")
@CrossOrigin(origins = "*")
public class TelemetryIngestionController {

    private final InfrastructureMonitoringService monitoringService;

    public TelemetryIngestionController(InfrastructureMonitoringService monitoringService) {
        this.monitoringService = monitoringService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<Void> ingestTelemetry(@RequestBody PerformanceMetric metric) {
        // Receives JSON payload from the Agent and passes it to your engine
        monitoringService.processRealTelemetry(metric);
        return ResponseEntity.ok().build();
    }
}