package com.smartcampus.service;

import com.smartcampus.dto.NotificationDTO;
import com.smartcampus.dto.NotificationPreferencesDTO;
import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.exception.UnauthorizedException;
import com.smartcampus.model.Notification;
import com.smartcampus.model.User;
import com.smartcampus.repository.NotificationRepository;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ===================== CREATE NOTIFICATION =====================

    @Transactional
    public void createNotification(Long userId,
                                   String title,
                                   String message,
                                   Notification.NotificationType type,
                                   Long referenceId,
                                   String referenceType,
                                   String actionUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Check user notification preferences
        if (!shouldSendNotification(user, type)) {
            log.info("Notification skipped due to user preferences: {} for user {}", type, userId);
            return;
        }

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .status(Notification.NotificationStatus.UNREAD)
                .referenceId(referenceId)
                .referenceType(referenceType)
                .actionUrl(actionUrl)
                .build();

        notificationRepository.save(notification);
        log.info("Notification created for user {}: {}", userId, title);
    }

    // ===================== GET NOTIFICATIONS =====================

    public Page<NotificationDTO> getNotifications(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository
                .findByUserOrderByCreatedAtDesc(user, pageable);

        return notifications.map(this::convertToDTO);
    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return notificationRepository
                .findByUserAndStatusOrderByCreatedAtDesc(user, Notification.NotificationStatus.UNREAD)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return notificationRepository.countByUserAndStatus(
                user, Notification.NotificationStatus.UNREAD);
    }

    // ===================== MARK AS READ =====================

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        int updated = notificationRepository.markAsRead(notificationId, user);
        if (updated == 0) {
            throw new ResourceNotFoundException("Notification", "id", notificationId);
        }
        log.info("Notification {} marked as read for user {}", notificationId, userId);
    }

    @Transactional
    public int markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        int count = notificationRepository.markAllAsRead(user);
        log.info("Marked {} notifications as read for user {}", count, userId);
        return count;
    }

    // ===================== DELETE NOTIFICATION =====================

    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Notification", "id", notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to delete this notification");
        }

        notificationRepository.delete(notification);
        log.info("Notification {} deleted by user {}", notificationId, userId);
    }

    // ===================== NOTIFICATION PREFERENCES =====================

    public NotificationPreferencesDTO getPreferences(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return NotificationPreferencesDTO.builder()
                .notificationBooking(user.getNotificationBooking())
                .notificationTicket(user.getNotificationTicket())
                .notificationComment(user.getNotificationComment())
                .notificationSystem(user.getNotificationSystem())
                .build();
    }

    @Transactional
    public NotificationPreferencesDTO updatePreferences(Long userId,
                                                        NotificationPreferencesDTO preferencesDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (preferencesDTO.getNotificationBooking() != null) {
            user.setNotificationBooking(preferencesDTO.getNotificationBooking());
        }
        if (preferencesDTO.getNotificationTicket() != null) {
            user.setNotificationTicket(preferencesDTO.getNotificationTicket());
        }
        if (preferencesDTO.getNotificationComment() != null) {
            user.setNotificationComment(preferencesDTO.getNotificationComment());
        }
        if (preferencesDTO.getNotificationSystem() != null) {
            user.setNotificationSystem(preferencesDTO.getNotificationSystem());
        }

        userRepository.save(user);
        log.info("Notification preferences updated for user {}", userId);

        return getPreferences(userId);
    }

    // ===================== HELPER METHODS (Called by other modules) =====================

    public void notifyBookingApproved(Long userId, Long bookingId, String resourceName) {
        createNotification(
                userId,
                "✅ Booking Approved",
                "Your booking for " + resourceName + " has been approved!",
                Notification.NotificationType.BOOKING_APPROVED,
                bookingId,
                "BOOKING",
                "/bookings/" + bookingId
        );
    }

    public void notifyBookingRejected(Long userId, Long bookingId,
                                      String resourceName, String reason) {
        createNotification(
                userId,
                "❌ Booking Rejected",
                "Your booking for " + resourceName + " was rejected. Reason: " + reason,
                Notification.NotificationType.BOOKING_REJECTED,
                bookingId,
                "BOOKING",
                "/bookings/" + bookingId
        );
    }

    public void notifyBookingCancelled(Long userId, Long bookingId, String resourceName) {
        createNotification(
                userId,
                "🚫 Booking Cancelled",
                "Your booking for " + resourceName + " has been cancelled.",
                Notification.NotificationType.BOOKING_CANCELLED,
                bookingId,
                "BOOKING",
                "/bookings/" + bookingId
        );
    }

    public void notifyTicketStatusChanged(Long userId, Long ticketId,
                                          String ticketTitle, String newStatus) {
        createNotification(
                userId,
                "🔄 Ticket Status Updated",
                "Your ticket '" + ticketTitle + "' status changed to " + newStatus,
                Notification.NotificationType.TICKET_STATUS_CHANGED,
                ticketId,
                "TICKET",
                "/tickets/" + ticketId
        );
    }

    public void notifyTicketAssigned(Long userId, Long ticketId,
                                     String ticketTitle, String technicianName) {
        createNotification(
                userId,
                "👨‍🔧 Technician Assigned",
                "Technician " + technicianName + " has been assigned to your ticket: " + ticketTitle,
                Notification.NotificationType.TICKET_ASSIGNED,
                ticketId,
                "TICKET",
                "/tickets/" + ticketId
        );
    }

    public void notifyCommentAdded(Long userId, Long ticketId,
                                   String ticketTitle, String commenterName) {
        createNotification(
                userId,
                "💬 New Comment",
                commenterName + " commented on your ticket: " + ticketTitle,
                Notification.NotificationType.COMMENT_ADDED,
                ticketId,
                "TICKET",
                "/tickets/" + ticketId
        );
    }

    public void notifySystemAlert(Long userId, String title, String message) {
        createNotification(
                userId,
                "⚠️ " + title,
                message,
                Notification.NotificationType.SYSTEM_ALERT,
                null,
                "SYSTEM",
                "/dashboard"
        );
    }

    // ===================== PRIVATE HELPERS =====================

    private boolean shouldSendNotification(User user, Notification.NotificationType type) {
        return switch (type) {
            case BOOKING_APPROVED, BOOKING_REJECTED, BOOKING_CANCELLED, BOOKING_PENDING ->
                    Boolean.TRUE.equals(user.getNotificationBooking());
            case TICKET_STATUS_CHANGED, TICKET_ASSIGNED, TICKET_RESOLVED ->
                    Boolean.TRUE.equals(user.getNotificationTicket());
            case COMMENT_ADDED ->
                    Boolean.TRUE.equals(user.getNotificationComment());
            case SYSTEM_ALERT, GENERAL ->
                    Boolean.TRUE.equals(user.getNotificationSystem());
        };
    }

    private NotificationDTO convertToDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .status(notification.getStatus())
                .referenceId(notification.getReferenceId())
                .referenceType(notification.getReferenceType())
                .actionUrl(notification.getActionUrl())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .isRead(notification.getStatus() == Notification.NotificationStatus.READ)
                .build();
    }
}