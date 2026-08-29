package com.service.assets.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "assets")
public class Asset {
    @Id
    @Column(name = "asset_id")
    private UUID assetId;

    @Column(name="ip", nullable = false)
    private String ip;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "type", nullable = false)
    private AssetType type;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private HealthStatus status;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public enum AssetType { SERVER, CLOUD_AWS, CLOUD_AZURE, K8S_POD }
    public enum HealthStatus { HEALTHY, WARNING, CRITICAL }

    public Asset() {}

    public Asset(UUID assetId, String ip, String name, AssetType type, HealthStatus status) {
        this.assetId = assetId;
        this.ip=ip;
        this.name = name;
        this.type = type;
        this.status = status;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public UUID getAssetId() { return assetId; }
    public void setAssetId(UUID assetId) { this.assetId = assetId; }
    public String getIp(){ return ip; }
    public void setIp(String ip){ this.ip=ip; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public AssetType getType() { return type; }
    public void setType(AssetType type) { this.type = type; }
    public HealthStatus getStatus() { return status; }
    public void setStatus(HealthStatus status) { this.status = status; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
