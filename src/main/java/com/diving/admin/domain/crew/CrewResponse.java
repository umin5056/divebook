package com.diving.admin.domain.crew;

public record CrewResponse(
        String crewId,
        String name,
        String description
) {
    public static CrewResponse from(Crew crew) {
        return new CrewResponse(
                crew.getCrewId(),
                crew.getName(),
                crew.getDescription()
        );
    }
}
