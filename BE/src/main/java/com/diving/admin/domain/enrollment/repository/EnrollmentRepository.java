package com.diving.admin.domain.enrollment.repository;

import com.diving.admin.domain.enrollment.entity.Enrollment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByLessonId(Long lessonId);

    List<Enrollment> findByLessonIdInAndIsApproval(List<Long> lessonIds, Boolean isApproval);
}
