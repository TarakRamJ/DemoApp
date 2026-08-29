package com.service.assets.dto;

import java.time.OffsetDateTime;

public class MonitoringChartDTO {
    private OffsetDateTime timestamp;
    private float cpuUsage;
    private float memoryUsage;
    private float diskUsage;
    private float networkUsage;

    public MonitoringChartDTO() {}

    public MonitoringChartDTO(OffsetDateTime timestamp, float cpuUsage, float memoryUsage, float diskUsage, float networkUsage) {
        this.timestamp = timestamp;
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        this.diskUsage = diskUsage;
        this.networkUsage = networkUsage;
    }

    public OffsetDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(OffsetDateTime timestamp) { this.timestamp = timestamp; }

    public float getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(float cpuUsage) { this.cpuUsage = cpuUsage; }

    public float getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(float memoryUsage) { this.memoryUsage = memoryUsage; }

    public float getDiskUsage() { return diskUsage; }
    public void setDiskUsage(float diskUsage) { this.diskUsage = diskUsage; }

    public float getNetworkUsage() { return networkUsage; }
    public void setNetworkUsage(float networkUsage) { this.networkUsage = networkUsage; }
}