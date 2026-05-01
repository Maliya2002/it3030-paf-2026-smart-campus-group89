package backend.dto;

import backend.model.NotificationType;
import java.time.LocalDateTime;

public class NotificationDTO {
    private Long id;
    private String recipientEmail;
    private NotificationType type;
    private String message;
    private String referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDTO() {}

    public NotificationDTO(Long id, String recipientEmail, NotificationType type, 
                          String message, String referenceId, boolean isRead, LocalDateTime createdAt) {
        this.id = id;
        this.recipientEmail = recipientEmail;
        this.type = type;
        this.message = message;
        this.referenceId = referenceId;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getReferenceId() {
        return referenceId;
    }

    public void setReferenceId(String referenceId) {
        this.referenceId = referenceId;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
