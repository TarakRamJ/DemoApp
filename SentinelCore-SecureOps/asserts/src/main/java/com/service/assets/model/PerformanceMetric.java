package com.service.assets.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "performance_metrics")
public class PerformanceMetric {
    @Id
    private UUID metricId;

    @Column(name = "asset_id", nullable = false)
    private UUID assetId;

    @Column(name = "cpu_usage")
    private float cpuUsage;

    @Column(name = "memory_usage")
    private float memoryUsage;

    @Column(name = "disk_usage")
    private float diskUsage;

    @Column(name = "network_usage")
    private float networkUsage;

    private OffsetDateTime timestamp;

    public PerformanceMetric() {}

    public PerformanceMetric(UUID assetId, float cpuUsage, float memoryUsage, float diskUsage, float networkUsage) {
        this.metricId = UUID.randomUUID();
        this.assetId = assetId;
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        this.diskUsage = diskUsage;
        this.networkUsage = networkUsage;
        this.timestamp = OffsetDateTime.now();
    }

    public UUID getMetricId() { return metricId; }
    public UUID getAssetId() { return assetId; }
    public float getCpuUsage() { return cpuUsage; }
    public float getMemoryUsage() { return memoryUsage; }
    public float getDiskUsage() { return diskUsage; }
    public float getNetworkUsage() { return networkUsage; }
    public OffsetDateTime getTimestamp() { return timestamp; }

    public void setMetricId(UUID metricId) {
        this.metricId = metricId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public void setCpuUsage(float cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public void setMemoryUsage(float memoryUsage) {
        this.memoryUsage = memoryUsage;
    }

    public void setDiskUsage(float diskUsage) {
        this.diskUsage = diskUsage;
    }

    public void setNetworkUsage(float networkUsage) {
        this.networkUsage = networkUsage;
    }

    public void setTimestamp(OffsetDateTime timestamp) {
        this.timestamp = timestamp;
    }
}