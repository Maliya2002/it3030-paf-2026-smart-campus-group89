package backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // Room A, Lab 1
    private String type;        // ROOM / LAB / EQUIPMENT
    private String location;
    private int capacity;

    private String status;      // ACTIVE / OUT_OF_SERVICE
}