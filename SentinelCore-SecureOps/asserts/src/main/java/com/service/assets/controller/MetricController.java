package com.service.assets.controller;

import com.service.assets.model.PerformanceMetric;
import com.service.assets.repo.PerformanceMetricRepository;
import com.service.assets.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "http://localhost:5173")
public class MetricController {

    @Autowired
    private PerformanceMetricRepository performanceMetricRepository;

    @GetMapping
    public List<PerformanceMetric> getAllMetrics() {
        return performanceMetricRepository.findAll();
    }

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/history/{assetId}")
    public ResponseEntity<List<com.service.assets.dto.MonitoringChartDTO>> getMonitoringHistory(@PathVariable UUID assetId) {
        return ResponseEntity.ok(dashboardService.getMonitoringHistory(assetId));
    }
}