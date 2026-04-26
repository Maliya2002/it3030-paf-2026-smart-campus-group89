package com.smartcampus.controller;

import com.smartcampus.dto.AuthRequest;
import com.smartcampus.dto.AuthResponse;
import com.smartcampus.dto.RegisterRequest;
import com.smartcampus.model.User;
import com.smartcampus.security.UserPrincipal;
import com.smartcampus.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // POST /api/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/me
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        User user = authService.getCurrentUser(currentUser.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("profilePicture", user.getProfilePicture());
        response.put("roles", user.getRoles());
        response.put("provider", user.getProvider());
        response.put("lastLogin", user.getLastLogin());
        response.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(response);
    }

    // PUT /api/auth/profile
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody Map<String, String> request) {

        User user = authService.updateProfile(
                currentUser.getId(),
                request.get("name"),
                request.get("profilePicture")
        );

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("profilePicture", user.getProfilePicture());
        response.put("roles", user.getRoles());
        response.put("message", "Profile updated successfully");

        return ResponseEntity.ok(response);
    }

    // GET /api/auth/validate
    @GetMapping("/validate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> validateToken(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("userId", currentUser.getId());
        response.put("email", currentUser.getEmail());
        response.put("roles", currentUser.getAuthorities());

        return ResponseEntity.ok(response);
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}