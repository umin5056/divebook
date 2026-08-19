package com.diving.admin.domain.enrollment.dto;

import com.diving.admin.domain.enrollment.entity.Enrollment;
import com.diving.admin.domain.enrollment.entity.PaymentStatus;

import com.diving.admin.domain.student.entity.Student;

public record EnrollmentResponse(
        Long enrollmentId,
        Long studentId,
        String name,
        String phone,
        PaymentStatus paymentStatus
) {
    public static EnrollmentResponse of(Enrollment enrollment, Student student) {
        return new EnrollmentResponse(
                enrollment.getEnrollmentId(),
                student.getStudentId(),
                student.getName(),
                student.getPhone(),
                enrollment.getPaymentStatus()
        );
    }
}
