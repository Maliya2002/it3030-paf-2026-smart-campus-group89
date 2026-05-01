package com.smartcampus;

import com.smartcampus.dto.RegisterRequest;
import com.smartcampus.exception.BadRequestException;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.security.JwtTokenProvider;
import com.smartcampus.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@sliit.lk");
        registerRequest.setPassword("password123");
    }

    @Test
    void register_WithNewEmail_ShouldSucceed() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(authenticationManager.authenticate(any()))
                .thenReturn(new UsernamePasswordAuthenticationToken(
                        "test@sliit.lk", "password123"));
        when(tokenProvider.generateToken(any())).thenReturn("jwt-token");
        when(tokenProvider.generateRefreshToken(anyString())).thenReturn("refresh-token");
        when(tokenProvider.getExpirationTime()).thenReturn(86400000L);

        // Act & Assert
        assertDoesNotThrow(() -> authService.register(registerRequest));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // Act & Assert
        assertThrows(BadRequestException.class,
                () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void getCurrentUser_WithValidEmail_ShouldReturnUser() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("test@sliit.lk");
        user.setName("Test User");

        when(userRepository.findByEmail("test@sliit.lk"))
                .thenReturn(Optional.of(user));

        // Act
        User result = authService.getCurrentUser("test@sliit.lk");

        // Assert
        assertNotNull(result);
        assertEquals("test@sliit.lk", result.getEmail());
        assertEquals("Test User", result.getName());
    }
}