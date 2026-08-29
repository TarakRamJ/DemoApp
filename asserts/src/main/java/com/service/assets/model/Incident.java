package com.service.assets.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "incidents")
public class Incident {

    public enum IncidentSeverity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum IncidentStatus {
        OPEN, ASSIGNED, INVESTIGATION, RESOLVED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String incidentTicket;

    @Enumerated(EnumType.STRING)
    private IncidentSeverity severity;

    @Enumerated(EnumType.STRING)
    private IncidentStatus status;

    private String type;
    private String sourceIp;
    private String impactSummary;
    private String assignedTeam;

    private int slaHours;
    private int etaMinutes;
    private LocalDateTime createdAt;


    public Incident() {
        this.createdAt = LocalDateTime.now();
    }


    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getIncidentTicket() { return incidentTicket; }
    public void setIncidentTicket(String incidentTicket) { this.incidentTicket = incidentTicket; }

    public IncidentSeverity getSeverity() { return severity; }
    public void setSeverity(IncidentSeverity severity) { this.severity = severity; }

    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSourceIp() { return sourceIp; }
    public void setSourceIp(String sourceIp) { this.sourceIp = sourceIp; }

    public String getImpactSummary() { return impactSummary; }
    public void setImpactSummary(String impactSummary) { this.impactSummary = impactSummary; }

    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }

    public int getSlaHours() { return slaHours; }
    public void setSlaHours(int slaHours) { this.slaHours = slaHours; }

    public int getEtaMinutes() { return etaMinutes; }
    public void setEtaMinutes(int etaMinutes) { this.etaMinutes = etaMinutes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}