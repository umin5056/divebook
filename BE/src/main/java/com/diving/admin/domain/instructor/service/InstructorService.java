package com.diving.admin.domain.instructor.service;

import com.diving.admin.domain.instructor.repository.InstructorRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstructorService {

    private final InstructorRepository instructorRepository;
}
