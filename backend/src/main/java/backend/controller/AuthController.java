package backend.controller;

import backend.dto.AuthResponse;
import backend.dto.GoogleAuthRequest;
import backend.model.UserModel;
import backend.model.UserRole;
import backend.repository.UserRepository;
import backend.security.JwtService;
import backend.security.SecurityUtils;
import backend.service.GoogleTokenVerifierService;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {
    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.admin.emails:}")
    private String adminEmails;

    public AuthController(
            GoogleTokenVerifierService googleTokenVerifierService,
            UserRepository userRepository,
            JwtService jwtService) {
        this.googleTokenVerifierService = googleTokenVerifierService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> loginWithGoogle(@RequestBody GoogleAuthRequest request) {
        Map<String, Object> profile = googleTokenVerifierService.verify(request.getIdToken());
        String email = profile.get("email").toString().trim().toLowerCase();
        String name = String.valueOf(profile.getOrDefault("name", email));

        UserModel user = userRepository.findByEmail(email).orElseGet(UserModel::new);
        user.setEmail(email);
        user.setFullName(name);
        if (user.getRole() == null) {
            user.setRole(resolveRole(email));
        }
        UserModel savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return ResponseEntity.ok(new AuthResponse(
                token,
                savedUser.getFullName(),
                savedUser.getEmail(),
                savedUser.getRole().name()));
    }

    @GetMapping("/me")
    public ResponseEntity<UserModel> currentUser() {
        String email = SecurityUtils.currentUserEmail();
        UserModel user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    private UserRole resolveRole(String email) {
        Set<String> admins = java.util.Arrays.stream(adminEmails.split(","))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
        return admins.contains(email) ? UserRole.ADMIN : UserRole.USER;
    }
}
