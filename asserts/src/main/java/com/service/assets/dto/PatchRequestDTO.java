package com.service.assets.dto;

public class PatchRequestDTO {
    private int serversToPatch;

    public PatchRequestDTO() {}

    public PatchRequestDTO(int serversToPatch) {
        this.serversToPatch = serversToPatch;
    }

    public int getServersToPatch() { return serversToPatch; }
    public void setServersToPatch(int serversToPatch) { this.serversToPatch = serversToPatch; }
}