package com.service.assets.dto;

import java.time.OffsetDateTime;

public class LoginResponse {

    private String token;
    private String username;
    private String role;
    private String email;
    private OffsetDateTime createdAt;

    public LoginResponse() {
    }

    public LoginResponse(String token, String username, String role, String email, OffsetDateTime createdAt) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.email = email;
        this.createdAt = createdAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}