package com.diving.admin.domain.enrollment.controller;

import com.diving.admin.domain.enrollment.dto.EnrollmentResponse;
import com.diving.admin.domain.enrollment.dto.PaymentStatusRequest;
import com.diving.admin.domain.enrollment.service.EnrollmentService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @GetMapping("/approvals")
    public ResponseEntity<List<EnrollmentResponse>> approvalDashboard(
            @AuthenticationPrincipal Long instructorId
    ) {
        return ResponseEntity.ok(enrollmentService.approvalDashboard(instructorId));
    }

    @PatchMapping("/{enrollmentId}/paymentStatus")
    public ResponseEntity<Void> updatePaymentStatus(
            @AuthenticationPrincipal Long instructorId,
            @PathVariable Long enrollmentId,
            @RequestBody PaymentStatusRequest request
    ) {
        enrollmentService.updatePaymentStatus(instructorId, enrollmentId, request.paymentStatus());
        return ResponseEntity.noContent().build();
    }
}
