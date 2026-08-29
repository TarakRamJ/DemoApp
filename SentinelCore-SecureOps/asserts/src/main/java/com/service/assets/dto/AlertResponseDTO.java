package com.service.assets.dto;

import java.util.UUID;

public class AlertResponseDTO {
    private UUID alertId;
    private UUID assetId;
    private String assetName;
    private String serverType;
    private String serverName;
    private String metricName;
    private float metricValue;
    private String severity;
    private String solution;

    public AlertResponseDTO() {}

    public AlertResponseDTO(UUID alertId, UUID assetId, String assetName, String metricName, 
                           float metricValue, String severity, String solution) {
        this.alertId = alertId;
        this.assetId = assetId;
        this.assetName = assetName;
        this.metricName = metricName;
        this.metricValue = metricValue;
        this.severity = severity;
        this.solution = solution;

        if (assetName != null && assetName.contains("-")) {
            String[] parts = assetName.split("-(?=[^-]*$)");
            if (parts.length == 2) {
                this.serverType = parts[0];
                this.serverName = parts[1];
            } else if (assetName.lastIndexOf("-") > 0) {
                this.serverType = assetName.substring(0, assetName.lastIndexOf("-"));
                this.serverName = assetName.substring(assetName.lastIndexOf("-") + 1);
            }
        }
    }
    public UUID getAlertId() { return alertId; }
    public void setAlertId(UUID alertId) { this.alertId = alertId; }

    public UUID getAssetId() { return assetId; }
    public void setAssetId(UUID assetId) { this.assetId = assetId; }

    public String getAssetName() { return assetName; }
    public void setAssetName(String assetName) { this.assetName = assetName; }

    public String getServerType() { return serverType; }
    public void setServerType(String serverType) { this.serverType = serverType; }

    public String getServerName() { return serverName; }
    public void setServerName(String serverName) { this.serverName = serverName; }

    public String getMetricName() { return metricName; }
    public void setMetricName(String metricName) { this.metricName = metricName; }

    public float getMetricValue() { return metricValue; }
    public void setMetricValue(float metricValue) { this.metricValue = metricValue; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getSolution() { return solution; }
    public void setSolution(String solution) { this.solution = solution; }
}
