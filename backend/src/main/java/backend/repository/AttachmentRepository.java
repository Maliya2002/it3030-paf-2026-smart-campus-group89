package backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import backend.model.AttachmentModel;

@Repository
public interface AttachmentRepository extends JpaRepository<AttachmentModel, Long> {
    List<AttachmentModel> findByTicketId(Long ticketId);
    
    Long countByTicketId(Long ticketId);
}
