package com.smartcampus.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcampus.dto.CommentRequest;
import com.smartcampus.dto.TicketRequest;
import com.smartcampus.model.Attachment;
import com.smartcampus.model.Comment;
import com.smartcampus.model.Ticket;
import com.smartcampus.service.FileStorageService;
import com.smartcampus.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final ObjectMapper objectMapper;
    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketRequest request) {
        Ticket ticket = ticketService.createTicket(request);
        return ResponseEntity.ok(ticket);
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String assignedTechnician,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String reportedBy
    ) {
        List<Ticket> tickets = ticketService.getAllTickets(status, priority, assignedTechnician, category, reportedBy);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping(value = "/{id}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable Long id,
            @RequestParam("ticketData") String ticketData,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) throws Exception {
        TicketRequest request = objectMapper.readValue(ticketData, TicketRequest.class);
        Ticket ticket = ticketService.updateTicket(id, request, files);
        return ResponseEntity.ok(ticket);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long ticketId,
            @Valid @RequestBody CommentRequest request
    ) {
        Comment comment = ticketService.addComment(ticketId, request);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/{ticketId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getComments(ticketId));
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request
    ) {
        Comment comment = ticketService.updateComment(ticketId, commentId, request);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @RequestParam("commentedBy") String commentedBy
    ) {
        ticketService.deleteComment(ticketId, commentId, commentedBy);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{ticketId}/attachments", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<List<Attachment>> uploadAttachments(
            @PathVariable Long ticketId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy
    ) {
        return ResponseEntity.ok(ticketService.uploadAttachments(ticketId, files, uploadedBy));
    }

    @GetMapping("/{ticketId}/attachments")
    public ResponseEntity<List<Attachment>> getAttachments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.getAttachments(ticketId));
    }

    @DeleteMapping("/{ticketId}/attachments/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long ticketId,
            @PathVariable Long attachmentId
    ) {
        ticketService.deleteAttachment(ticketId, attachmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/uploads/{fileName:.+}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable String fileName) {
        Attachment attachment = ticketService.getAttachmentByFileName(fileName);
        Resource resource = fileStorageService.loadFileAsResource(attachment.getStoredFileName());

        String contentType = attachment.getFileType();
        if (contentType == null || contentType.isBlank()) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }
}
