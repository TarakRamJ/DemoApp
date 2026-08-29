package com.service.assets.repo;

import com.service.assets.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AlertRepository extends JpaRepository<Alert, UUID> {
    List<Alert> findByAssetId(UUID assetId);
    List<Alert> findAllByOrderByCreatedAtAsc();
    long count();

    List<Alert> findTop5ByOrderByCreatedAtDesc();

    long countBySeverity(Alert.AlertSeverity severity);
}