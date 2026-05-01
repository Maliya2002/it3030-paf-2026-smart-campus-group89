package com.smartcampus.repository;

import com.smartcampus.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t " +
            "WHERE (:status IS NULL OR t.status = :status) " +
            "AND (:priority IS NULL OR t.priority = :priority) " +
            "AND (:assignedTechnician IS NULL OR t.assignedTechnician = :assignedTechnician) " +
            "AND (:category IS NULL OR t.category = :category) " +
            "AND (:reportedBy IS NULL OR t.reportedBy = :reportedBy) " +
            "ORDER BY t.createdAt DESC")
    List<Ticket> findByFilters(
            @Param("status") Ticket.TicketStatus status,
            @Param("priority") Ticket.TicketPriority priority,
            @Param("assignedTechnician") String assignedTechnician,
            @Param("category") String category,
            @Param("reportedBy") String reportedBy
    );
}
