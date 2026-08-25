package com.diving.admin.domain.enrollment.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_enrollment")
@Getter
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "enrollment_id")
    private Long enrollmentId;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable=false)
    private Boolean isApproval;

    @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    public void updatePaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
        this.isApproval = paymentStatus != PaymentStatus.pending;
        this.modifiedAt = java.time.LocalDateTime.now();
    }

}
