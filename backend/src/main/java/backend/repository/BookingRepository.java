package backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.model.BookingModel;
import backend.model.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<BookingModel, Long> {
    Optional<BookingModel> findByBookingId(String bookingId);

    List<BookingModel> findByStatus(BookingStatus status);

    List<BookingModel> findByRequestedBy(String requestedBy);

    List<BookingModel> findByResourceType(String resourceType);

    List<BookingModel> findByBookingDate(LocalDate bookingDate);

    List<BookingModel> findByResourceName(String resourceName);

    List<BookingModel> findByRequestedByContainingIgnoreCase(String requestedBy);

    List<BookingModel> findByRequestedByContainingIgnoreCaseAndStatus(
            String requestedBy, BookingStatus status);

    List<BookingModel> findByRequestedByContainingIgnoreCaseAndResourceTypeContainingIgnoreCase(
            String requestedBy, String resourceType);

    List<BookingModel> findByRequestedByContainingIgnoreCaseAndStatusAndResourceTypeContainingIgnoreCase(
            String requestedBy, BookingStatus status, String resourceType);

    @Query("SELECT b FROM BookingModel b WHERE b.resourceName = :resourceName AND b.bookingDate = :bookingDate AND b.status NOT IN ('CANCELLED', 'REJECTED')")
    List<BookingModel> findConflictingBookings(@Param("resourceName") String resourceName, @Param("bookingDate") LocalDate bookingDate);

    @Query("SELECT b FROM BookingModel b WHERE b.status = :status AND b.bookingDate >= :date ORDER BY b.bookingDate ASC")
    List<BookingModel> findUpcomingBookingsByStatus(@Param("status") BookingStatus status, @Param("date") LocalDate date);

    @Query("SELECT b FROM BookingModel b WHERE b.requestedBy = :requestedBy AND b.status = :status")
    List<BookingModel> findByRequestedByAndStatus(@Param("requestedBy") String requestedBy, @Param("status") BookingStatus status);
}
