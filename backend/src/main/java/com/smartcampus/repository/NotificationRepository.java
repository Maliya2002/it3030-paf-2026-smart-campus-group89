package com.smartcampus.repository;

import com.smartcampus.model.Notification;
import com.smartcampus.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    List<Notification> findByUserAndStatusOrderByCreatedAtDesc(
            User user,
            Notification.NotificationStatus status
    );

    Long countByUserAndStatus(User user, Notification.NotificationStatus status);

    @Modifying
    @Query("UPDATE Notification n SET n.status = 'READ', n.readAt = CURRENT_TIMESTAMP " +
            "WHERE n.user = :user AND n.status = 'UNREAD'")
    int markAllAsRead(@Param("user") User user);

    @Modifying
    @Query("UPDATE Notification n SET n.status = 'READ', n.readAt = CURRENT_TIMESTAMP " +
            "WHERE n.id = :id AND n.user = :user")
    int markAsRead(@Param("id") Long id, @Param("user") User user);

    List<Notification> findByUserAndTypeOrderByCreatedAtDesc(
            User user,
            Notification.NotificationType type
    );

    @Query("SELECT n FROM Notification n WHERE n.user = :user " +
            "ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotifications(
            @Param("user") User user,
            Pageable pageable
    );

    void deleteByUserAndId(User user, Long id);
}