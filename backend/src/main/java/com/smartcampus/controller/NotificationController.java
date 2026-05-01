package com.smartcampus.controller;

import com.smartcampus.dto.NotificationDTO;
import com.smartcampus.dto.NotificationPreferencesDTO;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // GET /api/notifications?page=0&size=10
    @GetMapping
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<NotificationDTO> notifications =
                notificationService.getNotifications(currentUser.getId(), page, size);
        return ResponseEntity.ok(notifications);
    }

    // GET /api/notifications/unread
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        List<NotificationDTO> notifications =
                notificationService.getUnreadNotifications(currentUser.getId());
        return ResponseEntity.ok(notifications);
    }

    // GET /api/notifications/count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long count = notificationService.getUnreadCount(currentUser.getId());
        Map<String, Long> response = new HashMap<>();
        response.put("unreadCount", count);
        return ResponseEntity.ok(response);
    }

    // PATCH /api/notifications/{id}/read
    @PatchMapping("/{id}/read")
    public ResponseEntity<Map<String, String>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        notificationService.markAsRead(id, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification marked as read");
        return ResponseEntity.ok(response);
    }

    // PATCH /api/notifications/read-all
    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        int count = notificationService.markAllAsRead(currentUser.getId());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        response.put("updatedCount", count);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/notifications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        notificationService.deleteNotification(id, currentUser.getId());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted successfully");
        return ResponseEntity.ok(response);
    }

    // GET /api/notifications/preferences
    @GetMapping("/preferences")
    public ResponseEntity<NotificationPreferencesDTO> getPreferences(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        NotificationPreferencesDTO preferences =
                notificationService.getPreferences(currentUser.getId());
        return ResponseEntity.ok(preferences);
    }

    // PUT /api/notifications/preferences
    @PutMapping("/preferences")
    public ResponseEntity<NotificationPreferencesDTO> updatePreferences(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody NotificationPreferencesDTO preferencesDTO) {

        NotificationPreferencesDTO updated =
                notificationService.updatePreferences(currentUser.getId(), preferencesDTO);
        return ResponseEntity.ok(updated);
    }
}