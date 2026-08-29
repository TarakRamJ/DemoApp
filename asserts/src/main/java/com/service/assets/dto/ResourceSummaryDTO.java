package com.service.assets.dto;

public class ResourceSummaryDTO {
    private float avgCpuUsage;
    private float avgMemoryUsage;
    private float avgDiskUsage;
    private float avgNetworkUsage;

    public ResourceSummaryDTO() {}

    public ResourceSummaryDTO(float avgCpuUsage, float avgMemoryUsage, float avgDiskUsage, float avgNetworkUsage) {
        this.avgCpuUsage = avgCpuUsage;
        this.avgMemoryUsage = avgMemoryUsage;
        this.avgDiskUsage = avgDiskUsage;
        this.avgNetworkUsage = avgNetworkUsage;
    }

    public float getAvgCpuUsage() { return avgCpuUsage; }
    public void setAvgCpuUsage(float avgCpuUsage) { this.avgCpuUsage = avgCpuUsage; }

    public float getAvgMemoryUsage() { return avgMemoryUsage; }
    public void setAvgMemoryUsage(float avgMemoryUsage) { this.avgMemoryUsage = avgMemoryUsage; }

    public float getAvgDiskUsage() { return avgDiskUsage; }
    public void setAvgDiskUsage(float avgDiskUsage) { this.avgDiskUsage = avgDiskUsage; }

    public float getAvgNetworkUsage() { return avgNetworkUsage; }
    public void setAvgNetworkUsage(float avgNetworkUsage) { this.avgNetworkUsage = avgNetworkUsage; }
}