package backend.model;

public enum BookingStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    CANCELLED("Cancelled"),
    REJECTED("Rejected");

    private final String displayName;

    BookingStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
