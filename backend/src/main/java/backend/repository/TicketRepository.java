package backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.model.TicketModel;
import backend.model.TicketPriority;
import backend.model.TicketStatus;

@Repository
public interface TicketRepository extends JpaRepository<TicketModel, Long> {
    Optional<TicketModel> findByTicketId(String ticketId);
    
    List<TicketModel> findByStatus(TicketStatus status);
    
    List<TicketModel> findByPriority(TicketPriority priority);
    
    List<TicketModel> findByAssignedTechnician(String technician);
    
    List<TicketModel> findByReportedBy(String reportedBy);
    
    List<TicketModel> findByCategory(String category);
    
    @Query("SELECT t FROM TicketModel t WHERE t.status = :status AND t.priority = :priority")
    List<TicketModel> findByStatusAndPriority(@Param("status") TicketStatus status, @Param("priority") TicketPriority priority);
    
    @Query("SELECT t FROM TicketModel t WHERE t.createdAt BETWEEN :startDate AND :endDate ORDER BY t.createdAt DESC")
    List<TicketModel> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM TicketModel t WHERE t.status != 'CLOSED' ORDER BY t.priority DESC, t.createdAt ASC")
    List<TicketModel> findOpenTickets();
}
