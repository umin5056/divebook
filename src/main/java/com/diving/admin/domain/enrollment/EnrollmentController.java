package com.diving.admin.domain.enrollment;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PatchMapping("/{enrollmentId}/payment-status")
    public ResponseEntity<Void> updatePaymentStatus(
            @PathVariable Long enrollmentId,
            @RequestBody PaymentStatusRequest request
    ) {
        enrollmentService.updatePaymentStatus(enrollmentId, request.paymentStatus());
        return ResponseEntity.noContent().build();
    }

    public record PaymentStatusRequest(PaymentStatus paymentStatus) {}
}
