package com.diving.admin.domain.enrollment.service;

import com.diving.admin.domain.enrollment.entity.Enrollment;
import com.diving.admin.domain.enrollment.entity.PaymentStatus;
import com.diving.admin.domain.enrollment.repository.EnrollmentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    @Transactional
    public void updatePaymentStatus(Long enrollmentId, PaymentStatus paymentStatus) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));
        enrollment.updatePaymentStatus(paymentStatus);
    }
}
