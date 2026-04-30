package backend.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

import backend.dto.BookingDecisionRequest;
import backend.model.BookingModel;
import backend.model.BookingStatus;
import backend.model.NotificationType;
import backend.repository.BookingRepository;
import backend.security.SecurityUtils;
import backend.service.NotificationService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingModel newBooking) {
        try {
            if (newBooking.getStartTime() == null || newBooking.getEndTime() == null
                    || !newBooking.getStartTime().isBefore(newBooking.getEndTime())) {
                return badRequest("Start time must be before end time");
            }

            if (newBooking.getBookingId() == null || newBooking.getBookingId().isEmpty()) {
                newBooking.setBookingId("BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            }
            if (newBooking.getRequestedBy() == null || newBooking.getRequestedBy().isBlank()) {
                newBooking.setRequestedBy(SecurityUtils.currentUserEmail());
            }
            newBooking.setStatus(BookingStatus.PENDING);
            newBooking.setApprovedBy(null);
            newBooking.setApprovedAt(null);
            newBooking.setDecisionReason(null);

            if (hasConflicts(newBooking, null)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(errorBody("Time slot conflicts with an existing booking"));
            }

            BookingModel savedBooking = bookingRepository.save(newBooking);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("Failed to create booking: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<BookingModel>> getAllBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) String requestedBy,
            @RequestParam(required = false) String resourceType,
            @RequestParam(required = false) String resourceName) {
        try {
            String normalizedRequestedBy = normalize(requestedBy);
            String normalizedType = normalize(resourceType);
            String normalizedName = normalize(resourceName);
            List<BookingModel> bookings = selectBaseBookings(status, normalizedRequestedBy, normalizedType);

            if (!normalizedName.isEmpty()) {
                bookings = bookings.stream()
                        .filter(booking -> booking.getResourceName() != null
                                && booking.getResourceName().toLowerCase().contains(normalizedName.toLowerCase()))
                        .toList();
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

            if (existingBooking.getStatus() != BookingStatus.PENDING) {
                return badRequest("Only pending bookings can be edited");
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
            if (existingBooking.getStartTime() == null || existingBooking.getEndTime() == null
                    || !existingBooking.getStartTime().isBefore(existingBooking.getEndTime())) {
                return badRequest("Start time must be before end time");
            }
            if (hasConflicts(existingBooking, existingBooking.getId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(errorBody("Updated time slot conflicts with an existing booking"));
            }

            BookingModel savedBooking = bookingRepository.save(existingBooking);
            return ResponseEntity.ok(savedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("Failed to update booking: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody BookingDecisionRequest request) {
        try {
            if (request.getStatus() == null) {
                return badRequest("Status is required");
            }
            BookingModel existingBooking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            BookingStatus targetStatus = request.getStatus();
            BookingStatus currentStatus = existingBooking.getStatus();

            if (targetStatus == BookingStatus.APPROVED || targetStatus == BookingStatus.REJECTED) {
                if (!"ADMIN".equalsIgnoreCase(normalize(request.getReviewerRole()))) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(errorBody("Only admins can approve or reject bookings"));
                }
                if (currentStatus != BookingStatus.PENDING) {
                    return badRequest("Only pending bookings can be approved or rejected");
                }
            }

            if (targetStatus == BookingStatus.CANCELLED) {
                if (currentStatus != BookingStatus.APPROVED) {
                    return badRequest("Only approved bookings can be cancelled");
                }
            }

            if (targetStatus != BookingStatus.APPROVED
                    && targetStatus != BookingStatus.REJECTED
                    && targetStatus != BookingStatus.CANCELLED) {
                return badRequest("Status transition is not allowed");
            }

            String decisionReason = normalize(request.getReason());
            if (decisionReason.isEmpty()) {
                return badRequest("A reason is required for this action");
            }

            existingBooking.setStatus(targetStatus);
            existingBooking.setDecisionReason(decisionReason);

            if (targetStatus == BookingStatus.APPROVED) {
                existingBooking.setApprovedBy(normalize(request.getReviewedBy()).isEmpty()
                        ? SecurityUtils.currentUserEmail()
                        : request.getReviewedBy());
                existingBooking.setApprovedAt(LocalDateTime.now());
            } else if (targetStatus == BookingStatus.REJECTED) {
                existingBooking.setApprovedBy(normalize(request.getReviewedBy()).isEmpty()
                        ? SecurityUtils.currentUserEmail()
                        : request.getReviewedBy());
                existingBooking.setApprovedAt(LocalDateTime.now());
            }

            BookingModel savedBooking = bookingRepository.save(existingBooking);
            if (targetStatus == BookingStatus.APPROVED) {
                notificationService.create(
                        savedBooking.getRequestedBy(),
                        NotificationType.BOOKING_APPROVED,
                        "Your booking " + savedBooking.getBookingId() + " was approved.",
                        savedBooking.getBookingId());
            } else if (targetStatus == BookingStatus.REJECTED) {
                notificationService.create(
                        savedBooking.getRequestedBy(),
                        NotificationType.BOOKING_REJECTED,
                        "Your booking " + savedBooking.getBookingId() + " was rejected.",
                        savedBooking.getBookingId());
            }
            return ResponseEntity.ok(savedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("Failed to update status: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteBooking(@PathVariable Long id) {
        try {
            bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            bookingRepository.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking with id " + id + " has been deleted successfully.");
            response.put("success", "true");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorBody("Failed to delete booking: " + e.getMessage()));
        }
    }

    @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(
            @RequestParam String resourceName,
            @RequestParam String bookingDate,
            @RequestParam String startTime,
            @RequestParam String endTime) {
        try {
            LocalDate date = LocalDate.parse(bookingDate);
            LocalTime sTime = LocalTime.parse(startTime);
            LocalTime eTime = LocalTime.parse(endTime);

            if (!sTime.isBefore(eTime)) {
                return badRequest("Start time must be before end time");
            }

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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(errorBody("Invalid request parameters: " + e.getMessage()));
        }
    }

    private List<BookingModel> selectBaseBookings(BookingStatus status, String requestedBy, String resourceType) {
        if (!requestedBy.isEmpty() && status != null && !resourceType.isEmpty()) {
            return bookingRepository.findByRequestedByContainingIgnoreCaseAndStatusAndResourceTypeContainingIgnoreCase(
                    requestedBy, status, resourceType);
        }
        if (!requestedBy.isEmpty() && status != null) {
            return bookingRepository.findByRequestedByContainingIgnoreCaseAndStatus(requestedBy, status);
        }
        if (!requestedBy.isEmpty() && !resourceType.isEmpty()) {
            return bookingRepository.findByRequestedByContainingIgnoreCaseAndResourceTypeContainingIgnoreCase(
                    requestedBy, resourceType);
        }
        if (!requestedBy.isEmpty()) {
            return bookingRepository.findByRequestedByContainingIgnoreCase(requestedBy);
        }
        if (status != null && !resourceType.isEmpty()) {
            return bookingRepository.findByStatus(status).stream()
                    .filter(booking -> booking.getResourceType() != null
                            && booking.getResourceType().toLowerCase().contains(resourceType.toLowerCase()))
                    .toList();
        }
        if (status != null) {
            return bookingRepository.findByStatus(status);
        }
        if (!resourceType.isEmpty()) {
            return bookingRepository.findByResourceType(resourceType);
        }
        return bookingRepository.findAll();
    }

    private boolean hasConflicts(BookingModel candidate, Long excludeId) {
        List<BookingModel> conflicts = bookingRepository.findConflictingBookings(
                candidate.getResourceName(), candidate.getBookingDate());

        return conflicts.stream().anyMatch(existing ->
                !Objects.equals(existing.getId(), excludeId)
                        && candidate.getStartTime().isBefore(existing.getEndTime())
                        && candidate.getEndTime().isAfter(existing.getStartTime()));
    }

    private ResponseEntity<Map<String, String>> badRequest(String message) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody(message));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }

    private Map<String, String> errorBody(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
