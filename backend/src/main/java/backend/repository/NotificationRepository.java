package backend.repository;

import backend.model.NotificationModel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationModel, Long> {
    List<NotificationModel> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
}
