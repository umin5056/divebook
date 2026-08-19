package com.diving.admin.domain.instructor.repository;

import com.diving.admin.domain.instructor.entity.Instructor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    Optional<Instructor> findByEmail(String email);
}
