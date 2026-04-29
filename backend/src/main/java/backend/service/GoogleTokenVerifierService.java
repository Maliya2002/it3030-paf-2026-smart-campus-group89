package backend.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GoogleTokenVerifierService {
    private final RestClient restClient = RestClient.create();

    @Value("${app.google.client-id:}")
    private String expectedClientId;

    @SuppressWarnings("unchecked")
    public Map<String, Object> verify(String idToken) {
        Map<String, Object> response = restClient.get()
                .uri("https://oauth2.googleapis.com/tokeninfo?id_token={token}", idToken)
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    throw new ResponseStatusException(res.getStatusCode(), "Google token validation failed");
                })
                .body(Map.class);

        if (response == null || response.get("email") == null) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid Google token");
        }

        if (!expectedClientId.isBlank()) {
            Object aud = response.get("aud");
            if (aud == null || !expectedClientId.equals(aud.toString())) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Google client mismatch");
            }
        }
        return response;
    }
}
