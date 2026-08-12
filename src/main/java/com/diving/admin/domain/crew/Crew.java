package com.diving.admin.domain.crew;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_crew")
@Getter
public class Crew {

    @Id
    @UuidGenerator
    @Column(name = "crew_id", length = 36)
    private String crewId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 36)
    private String instructorId;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime modifiedAt;
}
