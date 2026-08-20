package com.diving.admin.domain.auth.service;

import com.diving.admin.domain.auth.dto.LoginResponse;
import com.diving.admin.domain.auth.entity.RefreshToken;
import com.diving.admin.domain.auth.repository.RefreshTokenRepository;

import com.diving.admin.domain.instructor.entity.Instructor;
import com.diving.admin.domain.instructor.repository.InstructorRepository;
import com.diving.admin.global.jwt.JwtProperties;
import com.diving.admin.global.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final EmailVerificationService emailVerificationService;
    private final InstructorRepository instructorRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProvider jwtProvider;
    private final JwtProperties jwtProperties;
    private final PasswordEncoder passwordEncoder;

    public void sendCode(String email) {
        emailVerificationService.sendCode(email);
    }

    public void checkEmailCode(String email, String code) {
        if (!emailVerificationService.isCodeValid(email, code)) {
            throw new IllegalArgumentException("인증 코드가 올바르지 않거나 만료되었습니다.");
        }
    }

    public LoginResponse login(String email, String password) {
        Instructor instructor = instructorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (instructor.getPassword() == null || !passwordEncoder.matches(password, instructor.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return issueTokens(instructor.getInstructorId());
    }

    @Transactional
    public LoginResponse signup(String name, String email, String password, String code) {
        if (!emailVerificationService.verifyCode(email, code)) {
            throw new IllegalArgumentException("인증 코드가 올바르지 않거나 만료되었습니다.");
        }

        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자리 이상이어야 합니다.");
        }

        if (instructorRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        Instructor instructor = Instructor.create(email, name, null);
        instructor.changePassword(passwordEncoder.encode(password));
        instructorRepository.save(instructor);

        return issueTokens(instructor.getInstructorId());
    }

    public LoginResponse loginWithCode(String email, String code) {
        if (!emailVerificationService.verifyCode(email, code)) {
            throw new IllegalArgumentException("인증 코드가 올바르지 않거나 만료되었습니다.");
        }

        Instructor instructor = instructorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 강사입니다."));

        return issueTokens(instructor.getInstructorId());
    }

    @Transactional
    public LoginResponse resetPassword(String email, String password) {
        Instructor instructor = instructorRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("등록되지 않은 강사입니다."));

        instructor.changePassword(passwordEncoder.encode(password));

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

    @Transactional
    public void logout(String accessToken) {
        if (!jwtProvider.isValid(accessToken)) {
            throw new IllegalArgumentException("유효하지 않은 access token입니다.");
        }

        Long instructorId = Long.valueOf(jwtProvider.getUsername(accessToken));
        refreshTokenRepository.deleteByInstructorId(instructorId);
        refreshTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    private LoginResponse issueTokens(Long instructorId) {
        String accessToken = jwtProvider.createAccessToken(String.valueOf(instructorId));
        String refreshToken = jwtProvider.createRefreshToken(String.valueOf(instructorId));

        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(jwtProperties.refreshExpiration() / 1000);
        refreshTokenRepository.save(RefreshToken.create(instructorId, refreshToken, expiresAt));

        return new LoginResponse(accessToken, refreshToken);
    }
}
