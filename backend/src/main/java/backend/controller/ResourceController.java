package backend.controller;
import backend.service.PdfService;
import jakarta.validation.Valid;
import backend.model.Resource;
import backend.repository.ResourceRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
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

    // GET ALL + FILTER
    @GetMapping
    public List<Resource> getAll(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status
    ) {
        if (type == null && location == null) {
            return repo.findAll();
        }
        return repo.findByTypeContainingIgnoreCaseAndLocationContainingIgnoreCase(
                type == null ? "" : type,
                location == null ? "" : location,
                status == null ? "" : status
        );
    }
    //PDF
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

    // GET ONE
    @GetMapping("/{id}")
    public Resource getOne(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    // CREATE
    @PostMapping
    public Resource create(@Valid@RequestBody Resource r) {
        r.setStatus("ACTIVE");
        return repo.save(r);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Resource update(@PathVariable Long id, @RequestBody Resource r) {
        Resource existing = repo.findById(id).orElseThrow();
        existing.setName(r.getName());
        existing.setType(r.getType());
        existing.setLocation(r.getLocation());
        existing.setCapacity(r.getCapacity());
        return repo.save(existing);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // TOGGLE STATUS
    @PatchMapping("/{id}/status")
    public Resource toggle(@PathVariable Long id) {
        Resource r = repo.findById(id).orElseThrow();
        r.setStatus(r.getStatus().equals("ACTIVE") ? "OUT_OF_SERVICE" : "ACTIVE");
        return repo.save(r);
    }
}