package backend.repository;

import backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List<Resource> findByTypeContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String type, String location, String status
    );
}