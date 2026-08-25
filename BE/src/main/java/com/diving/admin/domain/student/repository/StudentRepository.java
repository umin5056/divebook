package com.diving.admin.domain.student.repository;

import com.diving.admin.domain.student.entity.Student;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
  List<Student> findByInstructorIdOrderByNameAsc(Long instructorId);
  Optional<Student> findByStudentIdAndInstructorId(Long studentId, Long instructorId);
}
