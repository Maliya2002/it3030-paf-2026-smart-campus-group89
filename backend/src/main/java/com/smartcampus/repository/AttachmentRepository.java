package com.smartcampus.repository;

import com.smartcampus.model.Attachment;
import com.smartcampus.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByTicketOrderByUploadedAtDesc(Ticket ticket);

    Optional<Attachment> findByIdAndTicket(Long id, Ticket ticket);

    Optional<Attachment> findFirstByFileName(String fileName);
}
