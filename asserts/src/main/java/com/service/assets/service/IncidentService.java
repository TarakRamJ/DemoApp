package com.service.assets.service;

import com.service.assets.model.Asset;
import com.service.assets.model.Incident;
import com.service.assets.model.PerformanceMetric;
import com.service.assets.repo.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class IncidentService {
    
    private IncidentRepository incidentRepository;
    private final Random random = new Random();
    
    public IncidentService(IncidentRepository incidentRepository){
        this.incidentRepository=incidentRepository;
    }

    public void triggerIncidentFromFailure(Asset asset, PerformanceMetric metric) {
        Incident incident = new Incident();
        incident.setIncidentTicket("INC-2026-" + (1000 + random.nextInt(9000)));
        incident.setSeverity(Incident.IncidentSeverity.CRITICAL);
        incident.setStatus(Incident.IncidentStatus.OPEN);
        incident.setType("Infrastructure Resource Exhaustion");
        incident.setSourceIp(asset.getIp());
        incident.setImpactSummary(String.format("Critical load on %s | CPU: %.1f%% | Mem: %.1f%%",
                asset.getName(), metric.getCpuUsage(), metric.getMemoryUsage()));
        incident.setAssignedTeam("Cloud Operations Team");
        incident.setSlaHours(1);
        incident.setEtaMinutes(30);

        incidentRepository.save(incident);
    }
}
