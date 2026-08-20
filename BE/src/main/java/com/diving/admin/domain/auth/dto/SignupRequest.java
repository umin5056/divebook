package com.diving.admin.domain.auth.dto;

public record SignupRequest(String name, String email, String password, String code) {}
