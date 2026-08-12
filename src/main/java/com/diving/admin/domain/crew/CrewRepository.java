package com.diving.admin.domain.crew;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CrewRepository extends JpaRepository<Crew, String> {

    CrewResponse findByInstructorId(String instructorId);

}
