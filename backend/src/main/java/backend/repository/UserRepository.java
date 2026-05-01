package backend.repository;

import backend.model.UserModel;
import backend.model.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserModel, Long> {
    Optional<UserModel> findByEmail(String email);
    List<UserModel> findByRole(UserRole role);
}
