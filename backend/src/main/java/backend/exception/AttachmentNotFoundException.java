package backend.exception;

public class AttachmentNotFoundException extends RuntimeException {
    public AttachmentNotFoundException(long id) {
        super("Attachment with id " + id + " not found");
    }

    public AttachmentNotFoundException(String message) {
        super(message);
    }
}
