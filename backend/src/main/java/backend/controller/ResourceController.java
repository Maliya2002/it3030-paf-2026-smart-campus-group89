package backend.controller;

import backend.model.Resource;
import backend.service.ResourceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    // GET all
    @GetMapping
    public ResponseEntity<List<Resource>> getAll(
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String location
    ) {
        return ResponseEntity.ok(service.getAll(type, location));
    }

    // GET by id
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Resource> create(@RequestBody Resource resource) {
        return ResponseEntity.ok(service.create(resource));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Resource> update(
        @PathVariable Long id,
        @RequestBody Resource resource
    ) {
        return ResponseEntity.ok(service.update(id, resource));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Resource> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(service.toggleStatus(id));
    }
}