package com.diving.admin.domain.auth;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {}
