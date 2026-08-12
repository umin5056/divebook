package com.diving.admin.domain.student;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<StudentResponse> getList(String instructorId) {
        return studentRepository.findByInstructorIdOrderByNameAsc(instructorId)
            .stream().map(StudentResponse::from).toList();

    }
}
