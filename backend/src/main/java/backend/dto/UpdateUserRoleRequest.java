package backend.dto;

import backend.model.UserRole;
import jakarta.validation.constraints.NotNull;

public class UpdateUserRoleRequest {
    @NotNull(message = "Role is required")
    private UserRole role;

    public UpdateUserRoleRequest() {}

    public UpdateUserRoleRequest(UserRole role) {
        this.role = role;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
