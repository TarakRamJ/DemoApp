package com.service.assets.service;

import com.service.assets.model.Incident;
import com.service.assets.repo.IncidentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Random;

@Service
public class IncidentSlaEngine {

    private final IncidentRepository incidentRepository;
    private final Random random = new Random();

    public IncidentSlaEngine(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    // Every 8 seconds, simulate incident movement and MTTR resolutions
    @Scheduled(fixedRate = 8000)
    public void processWorkflowAndResolutions() {
        List<Incident> activeIncidents = incidentRepository.findAll();

        for (Incident incident : activeIncidents) {
            // If open or assigned, progress it through the investigative workflow
            if (incident.getStatus() == Incident.IncidentStatus.OPEN) {
                incident.setStatus(Incident.IncidentStatus.ASSIGNED);
                incidentRepository.save(incident);
            } else if (incident.getStatus() == Incident.IncidentStatus.ASSIGNED && random.nextBoolean()) {
                incident.setStatus(Incident.IncidentStatus.INVESTIGATION);
                incidentRepository.save(incident);
            } else if (incident.getStatus() == Incident.IncidentStatus.INVESTIGATION && random.nextInt(3) == 0) {
                // 33% chance to resolve an ongoing investigation during this tick
                incident.setStatus(Incident.IncidentStatus.RESOLVED);
                incident.setEtaMinutes(0);
                incidentRepository.save(incident);
            } else if (incident.getStatus() != Incident.IncidentStatus.RESOLVED) {
                // Decrement the remaining ETA countdown
                int currentEta = incident.getEtaMinutes();
                if (currentEta > 2) {
                    incident.setEtaMinutes(currentEta - 2);
                    incidentRepository.save(incident);
                }
            }
        }
    }
}