package backend.repository;

import backend.model.NotificationModel;
import backend.model.NotificationType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    List<NotificationModel> findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(String recipientEmail);
    List<NotificationModel> findByRecipientEmailAndTypeOrderByCreatedAtDesc(String recipientEmail, NotificationType type);
    long countByRecipientEmailAndIsReadFalse(String recipientEmail);
}
