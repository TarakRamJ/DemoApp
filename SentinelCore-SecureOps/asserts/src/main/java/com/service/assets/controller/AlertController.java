package com.service.assets.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.service.assets.dto.AlertResponseDTO;
import com.service.assets.model.Alert;
import com.service.assets.model.Asset;
import com.service.assets.repo.AlertRepository;
import com.service.assets.repo.AssetRepository;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:5173")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private AssetRepository assetRepository;

    @GetMapping
    public List<AlertResponseDTO> getAllAlerts() {
        List<Alert> alerts = alertRepository.findAll();
        
        return alerts.stream()
            .map(alert -> {
                // Fetch the asset to get its name
                Asset asset = assetRepository.findById(alert.getAssetId()).orElse(null);
                String assetName = asset != null ? asset.getName() : "UNKNOWN";
                
                // Create response DTO with all fields populated
                AlertResponseDTO dto = new AlertResponseDTO(
                    alert.getAlertId(),
                    alert.getAssetId(),
                    assetName,
                    alert.getMetricName(),
                    alert.getViolationValue(),
                    alert.getSeverity().toString(),
                    alert.getSolution() != null ? alert.getSolution() : "Investigating"
                );
                
                // Set the server name if available
                if (alert.getServerName() != null) {
                    dto.setServerName(alert.getServerName());
                }
                
                return dto;
            })
            .collect(Collectors.toList());
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAlertStatistics() {
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("totalAlerts", alertRepository.count());
        return ResponseEntity.ok(stats);
    }
}