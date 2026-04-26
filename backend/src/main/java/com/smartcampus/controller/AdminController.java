package com.smartcampus.controller;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // GET /api/admin/users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // GET /api/admin/users/{id}
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return ResponseEntity.ok(user);
    }

    // PUT /api/admin/users/{id}/role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        String roleName = request.get("role");
        User.Role role = User.Role.valueOf(roleName.toUpperCase());
        user.getRoles().add(role);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Role updated successfully");
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/admin/users/{id}/role
    @DeleteMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> removeUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        String roleName = request.get("role");
        User.Role role = User.Role.valueOf(roleName.toUpperCase());
        user.getRoles().remove(role);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Role removed successfully");
        return ResponseEntity.ok(response);
    }

    // POST /api/admin/notify-all
    @PostMapping("/notify-all")
    public ResponseEntity<Map<String, Object>> sendNotificationToAll(
            @RequestBody Map<String, String> request) {

        String title = request.get("title");
        String message = request.get("message");

        List<User> allUsers = userRepository.findAllActiveUsers();
        allUsers.forEach(user ->
                notificationService.notifySystemAlert(user.getId(), title, message));

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Notification sent to " + allUsers.size() + " users");
        response.put("totalUsers", allUsers.size());
        return ResponseEntity.ok(response);
    }

    // GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", userRepository.countActiveUsers());
        stats.put("admins", userRepository.findByRole(User.Role.ADMIN).size());
        stats.put("technicians", userRepository.findByRole(User.Role.TECHNICIAN).size());
        return ResponseEntity.ok(stats);
    }
}