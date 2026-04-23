package backend.service;

import backend.model.Resource;
import java.util.List;

public interface ResourceService {

    List<Resource> getAll(String type, String location);
    Resource getById(Long id);
    Resource create(Resource resource);
    Resource update(Long id, Resource resource);
    void delete(Long id);
    Resource toggleStatus(Long id);
}