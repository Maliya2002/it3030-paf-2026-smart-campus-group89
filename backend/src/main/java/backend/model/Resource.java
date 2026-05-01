package backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Name: required, 2–100 characters
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    // ✅ Type: required (ROOM / LAB / EQUIPMENT)
    @NotBlank(message = "Type is required")
    @Pattern(regexp = "ROOM|LAB|EQUIPMENT", 
         message = "Type must be ROOM, LAB, or EQUIPMENT")
    private String type;

    // ✅ Location: required
    @NotBlank(message = "Location is required")
    private String location;

    // ✅ Capacity: must be at least 1
    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    // ✅ Status: default ACTIVE
    private String status = "ACTIVE";

    // 🔹 GETTERS & SETTERS

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
}