package com.service.assets.dto;

public class PerformanceMetricsDTO {
    private double avgTtdMs;
    private double minTtdMs;
    private double maxTtdMs;
    private double autoRemediationSuccessRate;
    private long successfulAutoRemediations;
    private long totalAutoRemediations;
    private long pendingRemediations;

    public PerformanceMetricsDTO(double avgTtdMs, double minTtdMs, double maxTtdMs,
                                 double autoRemediationSuccessRate, long successfulAutoRemediations,
                                 long totalAutoRemediations, long pendingRemediations) {
        this.avgTtdMs = avgTtdMs;
        this.minTtdMs = minTtdMs;
        this.maxTtdMs = maxTtdMs;
        this.autoRemediationSuccessRate = autoRemediationSuccessRate;
        this.successfulAutoRemediations = successfulAutoRemediations;
        this.totalAutoRemediations = totalAutoRemediations;
        this.pendingRemediations = pendingRemediations;
    }

    // Generate Getters and Setters here
    public double getAvgTtdMs() { return avgTtdMs; }
    public double getMinTtdMs() { return minTtdMs; }
    public double getMaxTtdMs() { return maxTtdMs; }
    public double getAutoRemediationSuccessRate() { return autoRemediationSuccessRate; }
    public long getSuccessfulAutoRemediations() { return successfulAutoRemediations; }
    public long getTotalAutoRemediations() { return totalAutoRemediations; }
    public long getPendingRemediations() { return pendingRemediations; }
}