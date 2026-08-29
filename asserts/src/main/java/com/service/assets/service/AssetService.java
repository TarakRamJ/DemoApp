package com.service.assets.service;

import com.service.assets.model.Asset;
import com.service.assets.repo.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AssetService {

    private AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository){
        this.assetRepository=assetRepository;
    }

    @Transactional
    public Asset createAsset(Asset asset) {
        if (asset.getAssetId() == null) {
            asset.setAssetId(UUID.randomUUID());
        }
        asset.setStatus(Asset.HealthStatus.HEALTHY);
        return assetRepository.save(asset);
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public List<Asset> getAllByIpPrefix(String prefix){
        return assetRepository.findByIpPrefix(prefix);
    }

    public Optional<Asset> getAssetById(UUID id) {
        return assetRepository.findById(id);
    }

    public Asset updateAsset(UUID id, Asset assetDetails) {
        Asset existingAsset = getAssetById(id).orElse(null);

        if (existingAsset == null) {
            return null;
        }

        existingAsset.setIp(assetDetails.getIp());
        existingAsset.setName(assetDetails.getName());
        existingAsset.setType(assetDetails.getType());
        existingAsset.setStatus(assetDetails.getStatus());
        existingAsset.setUpdatedAt(OffsetDateTime.now());

        return assetRepository.save(existingAsset);
    }

    @Transactional
    public void deleteAsset(UUID id) {
        assetRepository.deleteById(id);
    }
}
