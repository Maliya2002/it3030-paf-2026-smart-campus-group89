package backend.controller;

import backend.model.Resource;
import backend.repository.ResourceRepository;
import backend.service.PdfService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {

    private final ResourceRepository repo;

    public ResourceController(ResourceRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Resource> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status
    ) {
        if (type == null && location == null && status == null) {
            return repo.findAll();
        }

        return repo.findByTypeContainingIgnoreCaseAndLocationContainingIgnoreCaseAndStatusContainingIgnoreCase(
                type == null ? "" : type,
                location == null ? "" : location,
                status == null ? "" : status
        );
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf() {
        List<Resource> list = repo.findAll();
        ByteArrayInputStream pdf = PdfService.generate(list);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=resources.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf.readAllBytes());
    }

    @GetMapping("/{id}")
    public Resource getOne(@PathVariable Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
    }

    @PostMapping
    public Resource create(@Valid @RequestBody Resource r) {
        r.setStatus("ACTIVE");
        return repo.save(r);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable Long id, @RequestBody Resource r) {
        Resource existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        existing.setName(r.getName());
        existing.setType(r.getType());
        existing.setLocation(r.getLocation());
        existing.setCapacity(r.getCapacity());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PatchMapping("/{id}/status")
    public Resource toggle(@PathVariable Long id) {
        Resource r = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Resource not found"));
        r.setStatus(r.getStatus().equals("ACTIVE") ? "OUT_OF_SERVICE" : "ACTIVE");
        return repo.save(r);
    }
}
