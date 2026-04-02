package backend.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import backend.exception.AttachmentNotFoundException;
import backend.exception.CommentNotFoundException;
import backend.exception.TicketNotFoundException;
import backend.model.AttachmentModel;
import backend.model.CommentModel;
import backend.model.TicketModel;
import backend.model.TicketPriority;
import backend.model.TicketStatus;
import backend.repository.AttachmentRepository;
import backend.repository.CommentRepository;
import backend.repository.TicketRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/tickets")
public class TicketController {
    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private AttachmentRepository attachmentRepository;

    private final String UPLOAD_DIR = "src/main/uploads/attachments/";

    /**
     * POST /tickets – create incident ticket
     */
    @PostMapping
    public ResponseEntity<TicketModel> createTicket(@RequestBody TicketModel newTicket) {
        try {
            if (newTicket.getTicketId() == null || newTicket.getTicketId().isEmpty()) {
                newTicket.setTicketId("TKT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }
            TicketModel savedTicket = ticketRepository.save(newTicket);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTicket);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * GET /tickets – list tickets (with filters)
     */
    @GetMapping
    public ResponseEntity<List<TicketModel>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(required = false) TicketPriority priority,
            @RequestParam(required = false) String assignedTechnician,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String reportedBy) {
        try {
            List<TicketModel> tickets;

            if (status != null && priority != null) {
                tickets = ticketRepository.findByStatusAndPriority(status, priority);
            } else if (status != null) {
                tickets = ticketRepository.findByStatus(status);
            } else if (priority != null) {
                tickets = ticketRepository.findByPriority(priority);
            } else if (assignedTechnician != null) {
                tickets = ticketRepository.findByAssignedTechnician(assignedTechnician);
            } else if (category != null) {
                tickets = ticketRepository.findByCategory(category);
            } else if (reportedBy != null) {
                tickets = ticketRepository.findByReportedBy(reportedBy);
            } else {
                tickets = ticketRepository.findAll();
            }

            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /tickets/{id} – get ticket details
     */
    @GetMapping("/{id}")
    public ResponseEntity<TicketModel> getTicketById(@PathVariable Long id) {
        try {
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));
            return ResponseEntity.ok(ticket);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * PUT /tickets/{id} – update ticket (assign technician, change status)
     */
    @PutMapping("/{id}")
    public ResponseEntity<TicketModel> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketModel updatedTicketData) {
        try {
            TicketModel existingTicket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            // Update fields
            if (updatedTicketData.getTitle() != null) {
                existingTicket.setTitle(updatedTicketData.getTitle());
            }
            if (updatedTicketData.getDescription() != null) {
                existingTicket.setDescription(updatedTicketData.getDescription());
            }
            if (updatedTicketData.getStatus() != null) {
                existingTicket.setStatus(updatedTicketData.getStatus());
                if (updatedTicketData.getStatus() == TicketStatus.RESOLVED) {
                    existingTicket.setResolvedAt(LocalDateTime.now());
                }
            }
            if (updatedTicketData.getPriority() != null) {
                existingTicket.setPriority(updatedTicketData.getPriority());
            }
            if (updatedTicketData.getAssignedTechnician() != null) {
                existingTicket.setAssignedTechnician(updatedTicketData.getAssignedTechnician());
            }
            if (updatedTicketData.getCategory() != null) {
                existingTicket.setCategory(updatedTicketData.getCategory());
            }
            if (updatedTicketData.getLocation() != null) {
                existingTicket.setLocation(updatedTicketData.getLocation());
            }

            TicketModel savedTicket = ticketRepository.save(existingTicket);
            return ResponseEntity.ok(savedTicket);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * DELETE /tickets/{id} – delete ticket (ADMIN)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTicket(@PathVariable Long id) {
        try {
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            // Delete associated attachments and their files
            List<AttachmentModel> attachments = attachmentRepository.findByTicketId(id);
            for (AttachmentModel attachment : attachments) {
                deleteAttachmentFile(attachment.getFilePath());
                attachmentRepository.deleteById(attachment.getId());
            }

            // Delete comments
            List<CommentModel> comments = commentRepository.findByTicketId(id);
            for (CommentModel comment : comments) {
                commentRepository.deleteById(comment.getId());
            }

            // Delete ticket
            ticketRepository.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Ticket with id " + id + " has been deleted successfully.");
            response.put("success", "true");
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * POST /tickets/{id}/comments – add comment
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentModel> addComment(
            @PathVariable Long id,
            @RequestBody CommentModel newComment) {
        try {
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            newComment.setTicket(ticket);
            CommentModel savedComment = commentRepository.save(newComment);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * PUT /tickets/{id}/comments/{cid} – edit own comment
     */
    @PutMapping("/{id}/comments/{cid}")
    public ResponseEntity<CommentModel> editComment(
            @PathVariable Long id,
            @PathVariable Long cid,
            @RequestBody CommentModel updatedComment) {
        try {
            // Verify ticket exists
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            // Get and update comment
            CommentModel comment = commentRepository.findById(cid)
                    .orElseThrow(() -> new CommentNotFoundException(cid));

            // Verify comment belongs to ticket
            if (!comment.getTicket().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Only allow editing if comment was created by the same user
            if (!comment.getCommentedBy().equals(updatedComment.getCommentedBy())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            comment.setCommentText(updatedComment.getCommentText());
            CommentModel savedComment = commentRepository.save(comment);
            return ResponseEntity.ok(savedComment);
        } catch (TicketNotFoundException | CommentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * DELETE /tickets/{id}/comments/{cid} – delete own comment
     */
    @DeleteMapping("/{id}/comments/{cid}")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable Long id,
            @PathVariable Long cid,
            @RequestParam String commentedBy) {
        try {
            // Verify ticket exists
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            // Get comment
            CommentModel comment = commentRepository.findById(cid)
                    .orElseThrow(() -> new CommentNotFoundException(cid));

            // Verify comment belongs to ticket
            if (!comment.getTicket().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Only allow deletion if comment was created by the same user
            if (!comment.getCommentedBy().equals(commentedBy)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            commentRepository.deleteById(cid);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Comment with id " + cid + " has been deleted successfully.");
            response.put("success", "true");
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException | CommentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /tickets/{id}/attachments – upload images (max 3)
     */
    @PostMapping("/{id}/attachments")
    public ResponseEntity<Map<String, Object>> uploadAttachments(
            @PathVariable Long id,
            @RequestPart("files") MultipartFile[] files,
            @RequestParam String uploadedBy) {
        try {
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            // Check current attachment count
            long currentCount = attachmentRepository.countByTicketId(id);
            if (currentCount + files.length > 3) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Maximum 3 attachments allowed per ticket");
                errorResponse.put("currentAttachments", currentCount);
                errorResponse.put("maxAllowed", 3);
                errorResponse.put("attemptedToAdd", files.length);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            // Create uploads directory if it doesn't exist
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            List<AttachmentModel> savedAttachments = new java.util.ArrayList<>();

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    AttachmentModel attachment = saveAttachment(ticket, file, uploadedBy);
                    savedAttachments.add(attachment);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Attachments uploaded successfully");
            response.put("attachmentsUploaded", savedAttachments.size());
            response.put("attachments", savedAttachments);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload attachments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * GET /tickets/{id}/attachments – get all attachments for a ticket
     */
    @GetMapping("/{id}/attachments")
    public ResponseEntity<List<AttachmentModel>> getTicketAttachments(@PathVariable Long id) {
        try {
            // Verify ticket exists
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            List<AttachmentModel> attachments = attachmentRepository.findByTicketId(id);
            return ResponseEntity.ok(attachments);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * GET /tickets/{id}/comments – get all comments for a ticket
     */
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentModel>> getTicketComments(@PathVariable Long id) {
        try {
            // Verify ticket exists
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            List<CommentModel> comments = commentRepository.findByTicketId(id);
            return ResponseEntity.ok(comments);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * GET /uploads/attachments/{filename} – download attachment
     */
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<FileSystemResource> downloadAttachment(@PathVariable String filename) {
        try {
            File file = new File(UPLOAD_DIR + filename);
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(new FileSystemResource(file));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /tickets/{id}/attachments/{aid} – delete attachment
     */
    @DeleteMapping("/{id}/attachments/{aid}")
    public ResponseEntity<Map<String, String>> deleteAttachment(
            @PathVariable Long id,
            @PathVariable Long aid) {
        try {
            // Verify ticket exists
            TicketModel ticket = ticketRepository.findById(id)
                    .orElseThrow(() -> new TicketNotFoundException(id));

            // Get attachment
            AttachmentModel attachment = attachmentRepository.findById(aid)
                    .orElseThrow(() -> new AttachmentNotFoundException(aid));

            // Verify attachment belongs to ticket
            if (!attachment.getTicket().getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Delete file
            deleteAttachmentFile(attachment.getFilePath());

            // Delete record
            attachmentRepository.deleteById(aid);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Attachment with id " + aid + " has been deleted successfully.");
            response.put("success", "true");
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException | AttachmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Helper methods
    private AttachmentModel saveAttachment(TicketModel ticket, MultipartFile file, String uploadedBy) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        file.transferTo(Paths.get(UPLOAD_DIR + uniqueFileName));

        AttachmentModel attachment = new AttachmentModel(
                ticket,
                originalFileName,
                uniqueFileName,
                file.getContentType(),
                file.getSize(),
                uploadedBy
        );

        return attachmentRepository.save(attachment);
    }

    private void deleteAttachmentFile(String filePath) {
        try {
            File file = new File(UPLOAD_DIR + filePath);
            if (file.exists()) {
                file.delete();
            }
        } catch (Exception e) {
            System.out.println("Error deleting file: " + filePath);
        }
    }
}
