package com.smartcampus.security;

import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        return processOAuth2User(userRequest, oAuth2User);
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String providerId = (String) attributes.get("sub");
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update existing user
            user.setName(name);
            user.setProfilePicture(picture);
            user.setLastLogin(LocalDateTime.now());
            user = userRepository.save(user);
            log.info("Updated existing OAuth2 user: {}", email);
        } else {
            // Create new user
            Set<User.Role> roles = new HashSet<>();
            roles.add(User.Role.USER);

            user = User.builder()
                    .name(name)
                    .email(email)
                    .profilePicture(picture)
                    .provider(User.AuthProvider.GOOGLE)
                    .providerId(providerId)
                    .emailVerified(true)
                    .isActive(true)
                    .lastLogin(LocalDateTime.now())
                    .roles(roles)
                    .notificationBooking(true)
                    .notificationTicket(true)
                    .notificationComment(true)
                    .notificationSystem(true)
                    .build();

            user = userRepository.save(user);
            log.info("Created new OAuth2 user: {}", email);
        }

        return UserPrincipal.create(user, attributes);
    }
}