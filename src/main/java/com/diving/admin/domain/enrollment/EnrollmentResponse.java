package com.diving.admin.domain.enrollment;

import com.diving.admin.domain.student.Student;

public record EnrollmentResponse(
        String enrollmentId,
        String studentId,
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
