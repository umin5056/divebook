package com.diving.admin.domain.enrollment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {
    List<Enrollment> findByLessonId(String lessonId);
}
