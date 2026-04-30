package backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import backend.model.Resource;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    // Case-insensitive version (original)
    List<Resource> findByTypeContainingIgnoreCaseAndLocationContainingIgnoreCase(
            String type,
            String location
    );

    // Case-sensitive version (required by ResourceServiceImpl)
    List<Resource> findByTypeContainingAndLocationContaining(
            String type,
            String location
    );
}



