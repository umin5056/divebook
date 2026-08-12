package com.diving.admin.domain.auth;

import com.diving.admin.domain.instructor.Instructor;
import com.diving.admin.domain.instructor.InstructorRepository;
import com.diving.admin.global.jwt.JwtProperties;
import com.diving.admin.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmailVerificationService emailVerificationService;
    private final InstructorRepository instructorRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProvider jwtProvider;
    private final JwtProperties jwtProperties;

    public void sendCode(String email) {
        emailVerificationService.sendCode(email);
    }

    public LoginResponse verifyAndLogin(String email, String code) {
        if (!emailVerificationService.verifyCode(email, code)) {
            throw new IllegalArgumentException("인증 코드가 올바르지 않거나 만료되었습니다.");
        }

        Instructor instructor = instructorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 강사입니다."));

        return issueTokens(instructor.getInstructorId());
    }

    public LoginResponse refresh(String refreshToken) {
        if (!jwtProvider.isValid(refreshToken)) {
            throw new IllegalArgumentException("유효하지 않은 refresh token입니다.");
        }

        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("refresh token이 일치하지 않습니다."));

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(stored);
            throw new IllegalArgumentException("만료된 refresh token입니다.");
        }

        Long instructorId = stored.getInstructorId();
        refreshTokenRepository.delete(stored);

        return issueTokens(instructorId);
    }

    public void logout(String accessToken) {
        if (!jwtProvider.isValid(accessToken)) {
            throw new IllegalArgumentException("유효하지 않은 access token입니다.");
        }

        Long instructorId = Long.valueOf(jwtProvider.getUsername(accessToken));
        refreshTokenRepository.deleteByInstructorId(instructorId);
    }

    private LoginResponse issueTokens(Long instructorId) {
        String accessToken = jwtProvider.createAccessToken(String.valueOf(instructorId));
        String refreshToken = jwtProvider.createRefreshToken(String.valueOf(instructorId));

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(jwtProperties.refreshExpiration() / 1000);
        refreshTokenRepository.save(RefreshToken.create(instructorId, refreshToken, expiresAt));

        return new LoginResponse(accessToken, refreshToken);
    }
}
