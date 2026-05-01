package backend.service;

import backend.dto.NotificationDTO;
import backend.model.NotificationModel;
import backend.model.NotificationType;
import backend.repository.NotificationRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Create a new notification
     */
    public void create(String recipientEmail, NotificationType type, String message, String referenceId) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            return;
        }
        NotificationModel notification = new NotificationModel();
        notification.setRecipientEmail(recipientEmail.trim().toLowerCase());
        notification.setType(type);
        notification.setMessage(message);
        notification.setReferenceId(referenceId);
        notificationRepository.save(notification);
    }

    /**
     * Get all notifications for a recipient
     */
    public List<NotificationDTO> listByRecipient(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email.trim().toLowerCase())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notifications for a recipient
     */
    public List<NotificationDTO> listUnreadByRecipient(String email) {
        return notificationRepository.findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(email.trim().toLowerCase())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get notifications by type for a recipient
     */
    public List<NotificationDTO> listByRecipientAndType(String email, NotificationType type) {
        return notificationRepository.findByRecipientEmailAndTypeOrderByCreatedAtDesc(email.trim().toLowerCase(), type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notification count for a recipient
     */
    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email.trim().toLowerCase());
    }

    /**
     * Mark a notification as read
     */
    public NotificationDTO markAsRead(Long id) {
        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        notification.setRead(true);
        return convertToDTO(notificationRepository.save(notification));
    }

    /**
     * Mark all notifications as read for a recipient
     */
    public void markAllAsRead(String email) {
        List<NotificationModel> unreadNotifications = notificationRepository
                .findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(email.trim().toLowerCase());
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Delete a notification by ID
     */
    public void deleteNotification(Long id) {
        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        notificationRepository.delete(notification);
    }

    /**
     * Delete all notifications for a recipient
     */
    public void deleteAllByRecipient(String email) {
        List<NotificationModel> notifications = notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(email.trim().toLowerCase());
        notificationRepository.deleteAll(notifications);
    }

    /**
     * Get notification by ID
     */
    public NotificationDTO getNotificationById(Long id) {
        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));
        return convertToDTO(notification);
    }

    /**
     * Convert NotificationModel to NotificationDTO
     */
    private NotificationDTO convertToDTO(NotificationModel notification) {
        return new NotificationDTO(
                notification.getId(),
                notification.getRecipientEmail(),
                notification.getType(),
                notification.getMessage(),
                notification.getReferenceId(),
                notification.isRead(),
                notification.getCreatedAt()
        );
    }
}
