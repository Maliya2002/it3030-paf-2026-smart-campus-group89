package backend.exception;

public class TicketNotFoundException extends RuntimeException {
    public TicketNotFoundException(long id) {
        super("Ticket with id " + id + " not found");
    }

    public TicketNotFoundException(String ticketId, boolean isTicketId) {
        super("Ticket with ID " + ticketId + " not found");
    }

    public TicketNotFoundException(String message) {
        super(message);
    }
}
