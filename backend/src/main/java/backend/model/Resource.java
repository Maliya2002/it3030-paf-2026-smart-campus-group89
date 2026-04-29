package backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalTime;

@Entity
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Type is required")
    @Pattern(
            regexp = "CLASSROOM|LAB|MEETING_ROOM|AUDITORIUM|SPORTS_FACILITY|LIBRARY_ROOM|EVENT_SPACE|OTHER",
            message = "Invalid resource type"
    )
    private String type;

    @NotBlank(message = "Location is required")
    private String location;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    // Kept for backward-compatible DB schema (existing columns may be NOT NULL).
    @Column(name = "availability_start")
    private LocalTime availabilityStart;

    @Column(name = "availability_end")
    private LocalTime availabilityEnd;

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ACTIVE|OUT_OF_SERVICE", message = "Status must be ACTIVE or OUT_OF_SERVICE")
    private String status = "ACTIVE";

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalTime getAvailabilityStart() {
        return availabilityStart;
    }

    public void setAvailabilityStart(LocalTime availabilityStart) {
        this.availabilityStart = availabilityStart;
    }

    public LocalTime getAvailabilityEnd() {
        return availabilityEnd;
    }

    public void setAvailabilityEnd(LocalTime availabilityEnd) {
        this.availabilityEnd = availabilityEnd;
    }
}
