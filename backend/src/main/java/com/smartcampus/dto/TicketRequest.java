package com.smartcampus.dto;

import com.smartcampus.model.Ticket;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private Ticket.TicketStatus status;

    private Ticket.TicketPriority priority;

    @NotBlank(message = "Reporter email is required")
    private String reportedBy;

    private String assignedTechnician;

    private String category;

    private String location;
}
