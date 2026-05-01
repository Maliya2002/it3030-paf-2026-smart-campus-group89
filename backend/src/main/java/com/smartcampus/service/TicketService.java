package com.smartcampus.service;

import com.smartcampus.dto.CommentRequest;
import com.smartcampus.dto.TicketRequest;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.Attachment;
import com.smartcampus.model.Comment;
import com.smartcampus.model.Ticket;
import com.smartcampus.model.User;
import com.smartcampus.repository.AttachmentRepository;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;

    @Transactional
    public Ticket createTicket(TicketRequest request) {
        Ticket ticket = Ticket.builder()
                .ticketId(generateTicketId())
                .title(request.getTitle())
                .description(request.getDescription())
                .status(Optional.ofNullable(request.getStatus()).orElse(Ticket.TicketStatus.OPEN))
                .priority(Optional.ofNullable(request.getPriority()).orElse(Ticket.TicketPriority.MEDIUM))
                .reportedBy(request.getReportedBy())
                .assignedTechnician(request.getAssignedTechnician())
                .category(request.getCategory())
                .location(request.getLocation())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);
        log.info("Created ticket {} for {}", savedTicket.getTicketId(), savedTicket.getReportedBy());
        return savedTicket;
    }

    public List<Ticket> getAllTickets(String status, String priority,
                                      String assignedTechnician, String category,
                                      String reportedBy) {
        Ticket.TicketStatus ticketStatus = parseStatus(status);
        Ticket.TicketPriority ticketPriority = parsePriority(priority);
        return ticketRepository.findByFilters(
                ticketStatus,
                ticketPriority,
                normalizeString(assignedTechnician),
                normalizeString(category),
                normalizeString(reportedBy)
        );
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));
    }

    @Transactional
    public Ticket updateTicket(Long id, TicketRequest request, List<MultipartFile> files) {
        Ticket ticket = getTicketById(id);

        String previousStatus = ticket.getStatus() != null ? ticket.getStatus().name() : null;
        String previousAssignee = ticket.getAssignedTechnician();

        if (request.getTitle() != null) ticket.setTitle(request.getTitle());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());
        if (request.getStatus() != null) ticket.setStatus(request.getStatus());
        if (request.getPriority() != null) ticket.setPriority(request.getPriority());
        if (request.getReportedBy() != null) ticket.setReportedBy(request.getReportedBy());
        if (request.getAssignedTechnician() != null) ticket.setAssignedTechnician(request.getAssignedTechnician());
        if (request.getCategory() != null) ticket.setCategory(request.getCategory());
        if (request.getLocation() != null) ticket.setLocation(request.getLocation());

        if (ticket.getStatus() == Ticket.TicketStatus.RESOLVED && ticket.getResolvedAt() == null) {
            ticket.setResolvedAt(LocalDateTime.now());
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        processTicketNotifications(savedTicket, previousStatus, previousAssignee);

        if (files != null && !files.isEmpty()) {
            saveAttachments(savedTicket, files, null);
        }

        return savedTicket;
    }

    @Transactional
    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        attachmentRepository.findByTicketOrderByUploadedAtDesc(ticket).forEach(this::removeAttachmentFile);
        ticketRepository.delete(ticket);
    }

    @Transactional
    public Comment addComment(Long ticketId, CommentRequest request) {
        Ticket ticket = getTicketById(ticketId);

        Comment comment = Comment.builder()
                .ticket(ticket)
                .commentedBy(request.getCommentedBy())
                .commentText(request.getCommentText())
                .build();

        Comment savedComment = commentRepository.save(comment);
        notifyCommentAuthor(ticket, request.getCommentedBy());
        return savedComment;
    }

    public List<Comment> getComments(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        return commentRepository.findByTicketOrderByCreatedAtDesc(ticket);
    }

    @Transactional
    public void deleteComment(Long ticketId, Long commentId, String commentedBy) {
        Ticket ticket = getTicketById(ticketId);
        Comment comment = commentRepository.findByIdAndTicket(commentId, ticket)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        if (!comment.getCommentedBy().equals(commentedBy)) {
            throw new BadRequestException("Comment delete request must be made by the commenter");
        }

        commentRepository.delete(comment);
    }

    @Transactional
    public Comment updateComment(Long ticketId, Long commentId, CommentRequest request) {
        Ticket ticket = getTicketById(ticketId);
        Comment comment = commentRepository.findByIdAndTicket(commentId, ticket)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", commentId));

        comment.setCommentText(request.getCommentText());
        return commentRepository.save(comment);
    }

    @Transactional
    public List<Attachment> uploadAttachments(Long ticketId, List<MultipartFile> files, String uploadedBy) {
        if (files == null || files.isEmpty()) {
            throw new BadRequestException("No files uploaded");
        }

        Ticket ticket = getTicketById(ticketId);
        return saveAttachments(ticket, files, uploadedBy);
    }

    public List<Attachment> getAttachments(Long ticketId) {
        Ticket ticket = getTicketById(ticketId);
        return attachmentRepository.findByTicketOrderByUploadedAtDesc(ticket);
    }

    @Transactional
    public void deleteAttachment(Long ticketId, Long attachmentId) {
        Ticket ticket = getTicketById(ticketId);
        Attachment attachment = attachmentRepository.findByIdAndTicket(attachmentId, ticket)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "id", attachmentId));
        removeAttachmentFile(attachment);
        attachmentRepository.delete(attachment);
    }

    public Attachment getAttachmentByFileName(String fileName) {
        return attachmentRepository.findFirstByFileName(fileName)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment", "fileName", fileName));
    }

    public String getStoredFileName(Attachment attachment) {
        return attachment.getStoredFileName();
    }

    public String getAttachmentContentType(Attachment attachment) {
        return attachment.getFileType();
    }

    private List<Attachment> saveAttachments(Ticket ticket, List<MultipartFile> files, String uploadedBy) {
        List<Attachment> attachments = files.stream()
                .map(file -> {
                    String storedFileName = fileStorageService.storeFile(file);
                    Attachment attachment = Attachment.builder()
                            .ticket(ticket)
                            .fileName(file.getOriginalFilename())
                            .storedFileName(storedFileName)
                            .fileType(file.getContentType())
                            .fileSize(file.getSize())
                            .uploadedBy(uploadedBy)
                            .build();
                    return attachmentRepository.save(attachment);
                })
                .collect(Collectors.toList());

        ticket.getAttachments().addAll(attachments);
        ticketRepository.save(ticket);
        return attachments;
    }

    private void notifyCommentAuthor(Ticket ticket, String commenterEmail) {
        if (ticket.getReportedBy() == null) {
            return;
        }

        if (ticket.getReportedBy().equalsIgnoreCase(commenterEmail)) {
            return;
        }

        userRepository.findByEmail(ticket.getReportedBy())
                .ifPresent(user -> notificationService.notifyCommentAdded(
                        user.getId(),
                        ticket.getId(),
                        ticket.getTitle(),
                        commenterEmail
                ));
    }

    private void processTicketNotifications(Ticket ticket, String previousStatus, String previousAssignee) {
        if (previousStatus != null && !previousStatus.equals(ticket.getStatus().name())) {
            userRepository.findByEmail(ticket.getReportedBy())
                    .ifPresent(user -> notificationService.notifyTicketStatusChanged(
                            user.getId(),
                            ticket.getId(),
                            ticket.getTitle(),
                            ticket.getStatus().name()
                    ));
        }

        if (previousAssignee != null && !previousAssignee.equals(ticket.getAssignedTechnician())) {
            userRepository.findByEmail(ticket.getReportedBy())
                    .ifPresent(user -> notificationService.notifyTicketAssigned(
                            user.getId(),
                            ticket.getId(),
                            ticket.getTitle(),
                            ticket.getAssignedTechnician()
                    ));
        }
    }

    private void removeAttachmentFile(Attachment attachment) {
        try {
            Path storedFilePath = Paths.get(fileStorageService.loadFileAsResource(attachment.getStoredFileName()).getURI());
            Files.deleteIfExists(storedFilePath);
        } catch (Exception ex) {
            log.warn("Unable to delete attachment file: {}", ex.getMessage());
        }
    }

    private String generateTicketId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        int random = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "TKT-" + timestamp + random;
    }

    private Ticket.TicketStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return Ticket.TicketStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid ticket status: " + status);
        }
    }

    private Ticket.TicketPriority parsePriority(String priority) {
        if (priority == null || priority.isBlank()) {
            return null;
        }
        try {
            return Ticket.TicketPriority.valueOf(priority.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid ticket priority: " + priority);
        }
    }

    private String normalizeString(String value) {
        return value != null && !value.isBlank() ? value : null;
    }
}
