package com.service.assets.service;

import com.service.assets.model.Alert;
import com.service.assets.model.Asset;
import com.service.assets.model.PerformanceMetric;
import com.service.assets.repo.AlertRepository;
import com.service.assets.repo.AssetRepository;
import com.service.assets.repo.PerformanceMetricRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class InfrastructureMonitoringService {

    private final AssetRepository assetRepository;
    private final PerformanceMetricRepository metricRepository;
    private final AlertRepository alertRepository;
    private final IncidentService incidentService;
    private final Random random = new Random();

    public InfrastructureMonitoringService(AssetRepository assetRepository,
                                           PerformanceMetricRepository metricRepository,
                                           AlertRepository alertRepository,
                                           IncidentService incidentService) {
        this.assetRepository = assetRepository;
        this.metricRepository = metricRepository;
        this.alertRepository = alertRepository;
        this.incidentService = incidentService;
    }

    //Check the performance of all assets for every 15 seconds
    @Transactional
    public void processRealTelemetry(PerformanceMetric incomingMetric) {
        // 1. Verify the asset exists in our SOC database
        Optional<Asset> assetOpt = assetRepository.findById(incomingMetric.getAssetId());

        if (assetOpt.isEmpty()) {
            System.out.println("Unknown Asset ID attempted to send telemetry: " + incomingMetric.getAssetId());
            return;
        }

        Asset asset = assetOpt.get();

        // 2. Check if a metric record already exists to update it
        Optional<PerformanceMetric> existingMetricOpt = metricRepository.findByAssetId(asset.getAssetId());
        PerformanceMetric metricToSave;

        if (existingMetricOpt.isPresent()) {
            metricToSave = existingMetricOpt.get();
            metricToSave.setCpuUsage(incomingMetric.getCpuUsage());
            metricToSave.setMemoryUsage(incomingMetric.getMemoryUsage());
            metricToSave.setDiskUsage(incomingMetric.getDiskUsage());
            metricToSave.setNetworkUsage(incomingMetric.getNetworkUsage());
            metricToSave.setTimestamp(OffsetDateTime.now());
        } else {
            incomingMetric.setMetricId(UUID.randomUUID());
            incomingMetric.setTimestamp(OffsetDateTime.now());
            metricToSave = incomingMetric;
        }

        // 3. Save to database
        metricRepository.save(metricToSave);

        // 4. Trigger your exact same alert & incident evaluation logic!
        evaluateRulesAndHealth(asset, metricToSave);
    }

    //Evaluating the asset's performance matric
    private void evaluateRulesAndHealth(Asset asset, PerformanceMetric metric) {
        Asset.HealthStatus targetStatus = Asset.HealthStatus.HEALTHY;

        //Checking each matric health if any one is BAD/CRITICAL the targetStatus would be CRITICAL
        targetStatus = checkMetricThreshold(asset, "CPU", metric.getCpuUsage(), targetStatus);
        targetStatus = checkMetricThreshold(asset, "Memory", metric.getMemoryUsage(), targetStatus);
        targetStatus = checkMetricThreshold(asset, "Disk", metric.getDiskUsage(), targetStatus);

        //Only update if the status is changed
        if (asset.getStatus() != targetStatus) {
            asset.setStatus(targetStatus);
            asset.setUpdatedAt(OffsetDateTime.now());
            assetRepository.save(asset);

            //If the status is CRITICAL we need create Incident
            if (targetStatus == Asset.HealthStatus.CRITICAL) {
                incidentService.triggerIncidentFromFailure(asset, metric);
            }
        }
    }

    //Function to check each matric value with a threshold
    private Asset.HealthStatus checkMetricThreshold(Asset asset, String metricName, float value, Asset.HealthStatus currentEvaluatedStatus) {
        Asset.HealthStatus nextStatus = currentEvaluatedStatus;

        if (value >= 90.0f) {
            nextStatus = Asset.HealthStatus.CRITICAL;

            //Here matric reached the critical threshold so create alert with CRITICAL Severity
            triggerAlertIfNew(asset, metricName, value, Alert.AlertSeverity.CRITICAL);
        } else if (value >= 75.0f) {
            if (nextStatus != Asset.HealthStatus.CRITICAL) {
                nextStatus = Asset.HealthStatus.WARNING;
            }

            //Here matric reached the high threshold so create alert with HIGH Severity
            triggerAlertIfNew(asset, metricName, value, Alert.AlertSeverity.HIGH);
        } else {

            //Here matric is less any threshold so the issue/problem is resolved
            resolveAlertsIfAny(asset.getAssetId(), metricName);
        }

        //Return the status for Evaluation
        return nextStatus;
    }

    //If there is alert and this asset's alert is new then we need to create alert
    private void triggerAlertIfNew(Asset asset, String metricName, float value, Alert.AlertSeverity severity) {

        //retrieving all alerts with the required assetId and merticName
        List<Alert> activeAlerts = alertRepository.findByAssetId(asset.getAssetId());

        //Checking is it new or already exist
        boolean alreadyFired = activeAlerts.stream().anyMatch(a -> a.getMetricName().equalsIgnoreCase(metricName));

        //If the alert is new
        if (!alreadyFired) {

            //----Temporary Function for prototype----
            maintainAlertLimit();

            //Creating alert
            String solution=new String();
            if(metricName.equals("CPU")){
                solution="Auto Scaling";
            }else if(metricName.equals("Memory")){
                solution="Stop unnecessary processes";
            }else{
                solution="Clean Up";
            }
            Alert alert = new Alert(asset.getAssetId(), metricName, value, asset.getName(), severity,solution);

            //save alert
            alertRepository.save(alert);
        }
    }

    //If there is an alert the matric value get down means getting to SAFE state
    @Transactional
    private void resolveAlertsIfAny(UUID assetId, String metricName) {

        //Retrieve All Not resolved alerts of specific AssetId
        List<Alert> activeAlerts = alertRepository.findByAssetId(assetId);

        //filter alerts with same metricName and set resolved true
        activeAlerts.stream()
                .filter(a -> a.getMetricName().equalsIgnoreCase(metricName))
                .forEach(alertRepository::delete);
    }

    private void maintainAlertLimit() {
        long totalAlerts = alertRepository.count();
        if (totalAlerts >= 70) {
            List<Alert> alerts = alertRepository.findAllByOrderByCreatedAtAsc();
            alertRepository.delete(alerts.get(0));
        }
    }
}