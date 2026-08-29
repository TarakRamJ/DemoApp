package com.service.assets.dto;

public class DashboardOverviewDTO {
    private long totalAssets;
    private double uptimePercentage;
    private long activeAlerts;
    private long activeIncidents;
    private long resolvedIncidents;
    private int mttrMinutes;

    public DashboardOverviewDTO() {}

    public DashboardOverviewDTO(long totalAssets, double uptimePercentage, long activeAlerts,
                                long activeIncidents, long resolvedIncidents, int mttrMinutes) {
        this.totalAssets = totalAssets;
        this.uptimePercentage = uptimePercentage;
        this.activeAlerts = activeAlerts;
        this.activeIncidents = activeIncidents;
        this.resolvedIncidents = resolvedIncidents;
        this.mttrMinutes = mttrMinutes;
    }

    public long getTotalAssets() { return totalAssets; }
    public void setTotalAssets(long totalAssets) { this.totalAssets = totalAssets; }

    public double getUptimePercentage() { return uptimePercentage; }
    public void setUptimePercentage(double uptimePercentage) { this.uptimePercentage = uptimePercentage; }

    public long getActiveAlerts() { return activeAlerts; }
    public void setActiveAlerts(long activeAlerts) { this.activeAlerts = activeAlerts; }

    public long getActiveIncidents() { return activeIncidents; }
    public void setActiveIncidents(long activeIncidents) { this.activeIncidents = activeIncidents; }

    public long getResolvedIncidents() { return resolvedIncidents; }
    public void setResolvedIncidents(long resolvedIncidents) { this.resolvedIncidents = resolvedIncidents; }

    public int getMttrMinutes() { return mttrMinutes; }
    public void setMttrMinutes(int mttrMinutes) { this.mttrMinutes = mttrMinutes; }
}