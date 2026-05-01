package backend.controller;

import backend.dto.NotificationDTO;
import backend.model.NotificationType;
import backend.security.SecurityUtils;
import backend.service.NotificationService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Get all notifications for current user
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> listMyNotifications(
            @RequestParam(required = false) String type) {
        String email = SecurityUtils.currentUserEmail();
        
        if (type != null && !type.isEmpty()) {
            try {
                NotificationType notificationType = NotificationType.valueOf(type.toUpperCase());
                return ResponseEntity.ok(notificationService.listByRecipientAndType(email, notificationType));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        return ResponseEntity.ok(notificationService.listByRecipient(email));
    }

    /**
     * Get unread notifications for current user
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        String email = SecurityUtils.currentUserEmail();
        return ResponseEntity.ok(notificationService.listUnreadByRecipient(email));
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount() {
        String email = SecurityUtils.currentUserEmail();
        return ResponseEntity.ok(notificationService.getUnreadCount(email));
    }

    /**
     * Get notification by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<NotificationDTO> getNotification(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.getNotificationById(id));
    }

    /**
     * Mark notification as read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    /**
     * Mark all notifications as read
     */
    @PatchMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead() {
        String email = SecurityUtils.currentUserEmail();
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok().build();
    }

    /**
     * Delete notification by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete all notifications for current user
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteAllNotifications() {
        String email = SecurityUtils.currentUserEmail();
        notificationService.deleteAllByRecipient(email);
        return ResponseEntity.noContent().build();
    }
}
