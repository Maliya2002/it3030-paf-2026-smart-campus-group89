package com.smartcampus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferencesDTO {

    private Boolean notificationBooking;
    private Boolean notificationTicket;
    private Boolean notificationComment;
    private Boolean notificationSystem;
}