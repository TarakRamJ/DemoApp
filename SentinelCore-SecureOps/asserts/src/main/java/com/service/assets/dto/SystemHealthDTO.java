package com.service.assets.dto;

public class SystemHealthDTO {
    private long healthyAssets;
    private long warningAssets;
    private long criticalAssets;

    public SystemHealthDTO() {}

    public SystemHealthDTO(long healthyAssets, long warningAssets, long criticalAssets) {
        this.healthyAssets = healthyAssets;
        this.warningAssets = warningAssets;
        this.criticalAssets = criticalAssets;
    }

    public long getHealthyAssets() { return healthyAssets; }
    public void setHealthyAssets(long healthyAssets) { this.healthyAssets = healthyAssets; }

    public long getWarningAssets() { return warningAssets; }
    public void setWarningAssets(long warningAssets) { this.warningAssets = warningAssets; }

    public long getCriticalAssets() { return criticalAssets; }
    public void setCriticalAssets(long criticalAssets) { this.criticalAssets = criticalAssets; }
}