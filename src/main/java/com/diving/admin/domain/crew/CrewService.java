package com.diving.admin.domain.crew;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CrewService {

    private final CrewRepository crewRepository;
    
    public CrewResponse getCrew(String instructorId) {
        return crewRepository.findByInstructorId(instructorId);
    }
}
