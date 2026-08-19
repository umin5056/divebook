package com.diving.admin.domain.auth.dto;

public record EmailVerifyRequest(String email, String code) {}
