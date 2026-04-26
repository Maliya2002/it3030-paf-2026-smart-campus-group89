package backend.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import backend.model.BookingModel;
import backend.model.BookingStatus;
import backend.repository.BookingRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingModel newBooking) {
        try {
            if (newBooking.getBookingId() == null || newBooking.getBookingId().isEmpty()) {
                newBooking.setBookingId("BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }

            List<BookingModel> conflicts = bookingRepository.findConflictingBookings(
                    newBooking.getResourceName(), newBooking.getBookingDate());

            boolean hasTimeConflict = conflicts.stream().anyMatch(existing ->
                    (newBooking.getStartTime().isBefore(existing.getEndTime()) &&
                     newBooking.getEndTime().isAfter(existing.getStartTime()))
            );

            if (hasTimeConflict) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Time slot conflicts with an existing booking");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
            }

            BookingModel savedBooking = bookingRepository.save(newBooking);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to create booking: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingModel>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String requestedBy,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) String resourceName) {
        try {
            List<BookingModel> bookings;

            if (status != null && requestedBy != null) {
                bookings = bookingRepository.findByRequestedByAndStatus(requestedBy, status);
            } else if (status != null) {
                bookings = bookingRepository.findByStatus(status);
            } else if (requestedBy != null) {
                bookings = bookingRepository.findByRequestedBy(requestedBy);
            } else if (resourceType != null) {
                bookings = bookingRepository.findByResourceType(resourceType);
            } else if (resourceName != null) {
                bookings = bookingRepository.findByResourceName(resourceName);
            } else {
                bookings = bookingRepository.findAll();
            }

            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            BookingModel booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getBookingByBookingId(@PathVariable String bookingId) {
        try {
            BookingModel booking = bookingRepository.findByBookingId(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found with bookingId: " + bookingId));
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable Long id,
            @RequestBody BookingModel updatedBookingData) {
        try {
            BookingModel existingBooking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            if (existingBooking.getStatus() == BookingStatus.CANCELLED ||
                existingBooking.getStatus() == BookingStatus.REJECTED) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Cannot modify cancelled or rejected bookings");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (updatedBookingData.getTitle() != null) {
                existingBooking.setTitle(updatedBookingData.getTitle());
            }
            if (updatedBookingData.getDescription() != null) {
                existingBooking.setDescription(updatedBookingData.getDescription());
            }
            if (updatedBookingData.getResourceType() != null) {
                existingBooking.setResourceType(updatedBookingData.getResourceType());
            }
            if (updatedBookingData.getResourceName() != null) {
                existingBooking.setResourceName(updatedBookingData.getResourceName());
            }
            if (updatedBookingData.getBookingDate() != null) {
                existingBooking.setBookingDate(updatedBookingData.getBookingDate());
            }
            if (updatedBookingData.getStartTime() != null) {
                existingBooking.setStartTime(updatedBookingData.getStartTime());
            }
            if (updatedBookingData.getEndTime() != null) {
                existingBooking.setEndTime(updatedBookingData.getEndTime());
            }
            if (updatedBookingData.getLocation() != null) {
                existingBooking.setLocation(updatedBookingData.getLocation());
            }
            if (updatedBookingData.getAttendees() != null) {
                existingBooking.setAttendees(updatedBookingData.getAttendees());
            }
            if (updatedBookingData.getNotes() != null) {
                existingBooking.setNotes(updatedBookingData.getNotes());
            }

            BookingModel savedBooking = bookingRepository.save(existingBooking);
            return ResponseEntity.ok(savedBooking);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update booking: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status,
            @RequestParam(required = false) String approvedBy) {
        try {
            BookingModel existingBooking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            existingBooking.setStatus(status);

            if (status == BookingStatus.CONFIRMED && approvedBy != null) {
                existingBooking.setApprovedBy(approvedBy);
                existingBooking.setApprovedAt(LocalDateTime.now());
            }

            BookingModel savedBooking = bookingRepository.save(existingBooking);
            return ResponseEntity.ok(savedBooking);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long id) {
        try {
            BookingModel booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            bookingRepository.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking with id " + id + " has been deleted successfully.");
            response.put("success", "true");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete booking: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam String resourceName,
            @RequestParam String bookingDate,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        try {
            java.time.LocalDate date = java.time.LocalDate.parse(bookingDate);
            java.time.LocalTime sTime = java.time.LocalTime.parse(startTime);
            java.time.LocalTime eTime = java.time.LocalTime.parse(endTime);

            List<BookingModel> conflicts = bookingRepository.findConflictingBookings(resourceName, date);

            boolean isAvailable = conflicts.stream().noneMatch(existing ->
                    (sTime.isBefore(existing.getEndTime()) && eTime.isAfter(existing.getStartTime()))
            );

            Map<String, Object> response = new HashMap<>();
            response.put("available", isAvailable);
            response.put("resourceName", resourceName);
            response.put("bookingDate", bookingDate);
            response.put("startTime", startTime);
            response.put("endTime", endTime);

            if (!isAvailable) {
                response.put("conflictingBookings", conflicts);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid request parameters: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
