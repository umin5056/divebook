package com.diving.admin.domain.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {}
