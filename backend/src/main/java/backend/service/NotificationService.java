package backend.service;

import backend.model.NotificationModel;
import backend.model.NotificationType;
import backend.repository.NotificationRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

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

    public List<NotificationModel> listByRecipient(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email.trim().toLowerCase());
    }

    public NotificationModel markAsRead(Long id) {
        NotificationModel notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}
