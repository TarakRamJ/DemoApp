package com.service.assets.controller;

import com.service.assets.dto.*;
import com.service.assets.model.Incident;
import com.service.assets.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDTO> getOverview() {
        return ResponseEntity.ok(dashboardService.getOverview());
    }

    @GetMapping("/system-health")
    public ResponseEntity<SystemHealthDTO> getSystemHealth() {
        return ResponseEntity.ok(dashboardService.getSystemHealth());
    }

    @GetMapping("/recent-alerts")
    public ResponseEntity<List<AlertResponseDTO>> getRecentAlerts() {
        return ResponseEntity.ok(dashboardService.getRecentAlerts());
    }

    @GetMapping("/recent-incidents")
    public ResponseEntity<List<Incident>> getRecentIncidents() {
        return ResponseEntity.ok(dashboardService.getRecentIncidents());
    }

    @GetMapping("/resource-summary")
    public ResponseEntity<ResourceSummaryDTO> getResourceSummary() {
        return ResponseEntity.ok(dashboardService.getResourceSummary());
    }

    @GetMapping("/charts")
    public ResponseEntity<List<MonitoringChartDTO>> getChartData(@RequestParam(required = false) UUID assetId) {
        return ResponseEntity.ok(dashboardService.getMonitoringHistory(assetId));
    }
}