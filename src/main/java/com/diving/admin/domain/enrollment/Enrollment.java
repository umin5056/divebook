package com.diving.admin.domain.enrollment;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_enrollment")
@Getter
public class Enrollment {

    @Id
    @UuidGenerator
    @Column(name = "enrollment_id", length = 36)
    private String enrollmentId;

    @Column(name = "lesson_id", nullable = false, length = 36)
    private String lessonId;

    @Column(name = "student_id", nullable = false, length = 36)
    private String studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;

    public void updatePaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
        this.modifiedAt = java.time.LocalDateTime.now();
    }
}
