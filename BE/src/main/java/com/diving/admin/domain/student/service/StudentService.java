package com.diving.admin.domain.student.service;

import com.diving.admin.domain.student.dto.StudentResponse;
import com.diving.admin.domain.student.entity.Student;
import com.diving.admin.domain.student.repository.StudentRepository;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<StudentResponse> getList(Long instructorId) {
        return studentRepository.findByInstructorIdOrderByNameAsc(instructorId)
            .stream().map(StudentResponse::from).toList();
    }

    @Transactional
    public void update(Long instructorId, Long studentId, String content) {
        Student student = studentRepository.findByStudentIdAndInstructorId(studentId, instructorId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        student.update(content);
    }
}
