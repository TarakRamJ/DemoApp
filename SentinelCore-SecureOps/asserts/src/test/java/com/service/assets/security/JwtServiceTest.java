package com.service.assets.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    @Test
    void shouldGenerateAndValidateToken() {
        JwtService jwtService = new JwtService("test-secret-key-that-is-long-enough", 3600000L);

        String token = jwtService.generateToken("demo-user", "EMPLOYEE");

        assertNotNull(token);
        assertEquals("demo-user", jwtService.extractUsername(token));
        assertTrue(jwtService.isTokenValid(token, "demo-user"));
    }
}
