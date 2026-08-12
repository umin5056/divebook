package com.diving.admin.domain.auth;

public record EmailVerifyRequest(String email, String code) {}
