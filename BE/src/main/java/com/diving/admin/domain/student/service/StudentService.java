package com.diving.admin.domain.student.service;

import com.diving.admin.domain.student.dto.StudentResponse;
import com.diving.admin.domain.student.repository.StudentRepository;

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
}
