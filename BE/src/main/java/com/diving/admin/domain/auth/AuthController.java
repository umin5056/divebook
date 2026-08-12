package com.diving.admin.domain.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/email/send")
    public ResponseEntity<Void> sendCode(@RequestBody EmailSendRequest request) {
        authService.sendCode(request.email());
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/email/verify")
    public ResponseEntity<LoginResponse> verify(@RequestBody EmailVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyAndLogin(request.email(), request.code()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(@RequestBody RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String bearer) {
        String accessToken = bearer.substring(7);
        authService.logout(accessToken);
        return ResponseEntity.noContent().build();
    }
}
