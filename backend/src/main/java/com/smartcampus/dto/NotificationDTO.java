package com.smartcampus.dto;

import com.smartcampus.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private Long id;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private Notification.NotificationStatus status;
    private Long referenceId;
    private String referenceType;
    private String actionUrl;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private boolean isRead;
}