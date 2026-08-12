package com.diving.admin.domain.student;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, String> {
  List<Student> findByInstructorIdOrderByNameAsc(String instructorId);
}
