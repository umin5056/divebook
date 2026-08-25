package com.diving.admin.domain.enrollment.service;

import com.diving.admin.domain.enrollment.dto.EnrollmentResponse;
import com.diving.admin.domain.enrollment.entity.Enrollment;
import com.diving.admin.domain.enrollment.entity.PaymentStatus;
import com.diving.admin.domain.enrollment.repository.EnrollmentRepository;
import com.diving.admin.domain.lesson.entity.Lesson;
import com.diving.admin.domain.lesson.repository.LessonRepository;
import com.diving.admin.domain.student.entity.Student;
import com.diving.admin.domain.student.repository.StudentRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final StudentRepository studentRepository;
    

    @Transactional
    public List<EnrollmentResponse> approvalDashboard(Long instructorId) {
        Map<Long, Lesson> lessons = lessonRepository
                .findByInstructorIdOrderByLessonDate(instructorId)
                .stream()
                .collect(Collectors.toMap(Lesson::getLessonId, l -> l));

        List<Enrollment> enrollments = enrollmentRepository
                .findByLessonIdInAndIsApproval(lessons.keySet().stream().toList(), false);

        Map<Long, Student> students = studentRepository
                .findAllById(enrollments.stream().map(Enrollment::getStudentId).toList())
                .stream()
                .collect(Collectors.toMap(Student::getStudentId, s -> s));

        return enrollments.stream()
            .map(e -> EnrollmentResponse.of(e, students.get(e.getStudentId()), lessons.get(e.getLessonId())))
            .toList();
    }

    @Transactional
    public void updatePaymentStatus(Long instructorId, Long enrollmentId, PaymentStatus paymentStatus) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

        lessonRepository.findByLessonIdAndInstructorId(enrollment.getLessonId(), instructorId)
                .orElseThrow(() -> new IllegalArgumentException("Enrollment not found"));

        enrollment.updatePaymentStatus(paymentStatus);
    }
}
