package com.service.assets.service;

import com.service.assets.model.Incident;
import com.service.assets.repo.IncidentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.Random;

@Service
public class SecurityIncidentSimulator {

    private final IncidentRepository incidentRepository;
    private final Random random = new Random();

    private final String[] attackTypes = {
            "Failed Login Attempts",
            "Unauthorized API Access",
            "SQL Injection Attempt",
            "Suspicious SSH Scan"
    };

    private final String[] targetUsers = {"admin", "root", "db_user", "system_api"};

    public SecurityIncidentSimulator(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    // Runs automatically every 15 seconds to simulate external attacks
    @Scheduled(fixedRate = 10000)
    public void simulateExternalSecurityThreats() {
        // Keep active incidents within a realistic range for the dashboard screen
        if (incidentRepository.count() >= 35) {
            return;
        }

        Incident.IncidentSeverity[] severities = Incident.IncidentSeverity.values();
        Incident.IncidentSeverity randomSeverity = severities[random.nextInt(severities.length)];

        Incident securityIncident = new Incident();
        securityIncident.setIncidentTicket("INC-2026-" + (1000 + random.nextInt(9000)));
        securityIncident.setSeverity(randomSeverity);
        securityIncident.setStatus(Incident.IncidentStatus.OPEN);
        securityIncident.setType(attackTypes[random.nextInt(attackTypes.length)]);
        securityIncident.setSourceIp("192.168.1." + random.nextInt(255));

        int failures = 5 + random.nextInt(20);
        securityIncident.setImpactSummary(String.format("%d events detected | Target User: %s | Account Locked",
                failures, targetUsers[random.nextInt(targetUsers.length)]));

        securityIncident.setAssignedTeam("SOC Tier 1");
        securityIncident.setSlaHours(2);
        securityIncident.setEtaMinutes(10 + random.nextInt(110));

        incidentRepository.save(securityIncident);
    }
}
