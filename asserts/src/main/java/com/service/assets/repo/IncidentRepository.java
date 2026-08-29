package com.service.assets.repo;

import com.service.assets.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {

    List<Incident> findTop5ByOrderByCreatedAtDesc();

    long countByStatus(Incident.IncidentStatus status);

    long countByStatusNot(Incident.IncidentStatus status);

    List<Incident> findBySeverityAndStatusNot(Incident.IncidentSeverity severity,Incident.IncidentStatus status);
}