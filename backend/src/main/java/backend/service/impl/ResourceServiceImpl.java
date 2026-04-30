package backend.service.impl;

import backend.model.Resource;
import backend.repository.ResourceRepository;
import backend.service.ResourceService;
import backend.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repo;

    public ResourceServiceImpl(ResourceRepository repo) {
        this.repo = repo;
    }

    @Override
    public List<Resource> getAll(String type, String location) {
        return repo.findByTypeContainingAndLocationContaining(
            type == null ? "" : type,
            location == null ? "" : location
        );
    }

    @Override
    public Resource getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));
    }

    @Override
    public Resource create(Resource resource) {
        resource.setStatus("ACTIVE");
        return repo.save(resource);
    }

    @Override
    public Resource update(Long id, Resource updated) {
        Resource r = getById(id);
        r.setName(updated.getName());
        r.setType(updated.getType());
        r.setLocation(updated.getLocation());
        r.setCapacity(updated.getCapacity());
        return repo.save(r);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }

    @Override
    public Resource toggleStatus(Long id) {
        Resource r = getById(id);
        r.setStatus(r.getStatus().equals("ACTIVE")
                ? "OUT_OF_SERVICE"
                : "ACTIVE");
        return repo.save(r);
    }
}