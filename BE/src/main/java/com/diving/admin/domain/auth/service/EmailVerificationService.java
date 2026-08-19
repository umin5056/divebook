package com.diving.admin.domain.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final long CODE_TTL_MINUTES = 5;

    private final JavaMailSender mailSender;
    private final Map<String, VerificationCode> codeStore = new ConcurrentHashMap<>();

    public void sendCode(String email) {
        String code = generateCode();
        codeStore.put(email, new VerificationCode(code, LocalDateTime.now().plusMinutes(CODE_TTL_MINUTES)));

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[DiveBook] 이메일 인증 코드");
        message.setText("인증 코드: " + code + " (5분 이내 입력)");
        mailSender.send(message);
    }

    public boolean verifyCode(String email, String code) {
        VerificationCode stored = codeStore.get(email);
        if (stored == null || stored.expiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        boolean matched = stored.code().equals(code);
        if (matched) {
            codeStore.remove(email);
        }
        return matched;
    }

    private String generateCode() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
    }

    @Scheduled(fixedRate = 60_000)
    void removeExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        codeStore.values().removeIf(code -> code.expiresAt().isBefore(now));
    }

    private record VerificationCode(String code, LocalDateTime expiresAt) {}
}
