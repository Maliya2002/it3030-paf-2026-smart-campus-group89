package com.smartcampus.repository;

import com.smartcampus.model.Comment;
import com.smartcampus.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTicketOrderByCreatedAtDesc(Ticket ticket);

    Optional<Comment> findByIdAndTicket(Long id, Ticket ticket);
}
