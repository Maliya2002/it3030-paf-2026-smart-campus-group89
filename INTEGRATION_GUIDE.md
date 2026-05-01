#!/bin/bash

# Modules D & E Implementation Integration Script
# This guide shows how to trigger notifications from existing services

# INTEGRATION POINTS FOR NOTIFICATIONS

## 1. BOOKING SERVICE INTEGRATION
# File: backend/src/main/java/backend/service/BookingService.java

# When booking is approved, add:
```java
import backend.model.NotificationType;

// In BookingService class
private final NotificationService notificationService;

public BookingModel approveBooking(Long bookingId) {
    BookingModel booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    
    booking.setStatus(BookingStatus.APPROVED);
    BookingModel approvedBooking = bookingRepository.save(booking);
    
    // TRIGGER NOTIFICATION
    notificationService.create(
        booking.getUser().getEmail(),
        NotificationType.BOOKING_APPROVED,
        "Your booking for '" + booking.getResource().getName() + 
        "' on " + booking.getBookingDate() + " has been approved.",
        "booking-" + booking.getId()
    );
    
    return approvedBooking;
}

public BookingModel rejectBooking(Long bookingId) {
    BookingModel booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new RuntimeException("Booking not found"));
    
    booking.setStatus(BookingStatus.REJECTED);
    BookingModel rejectedBooking = bookingRepository.save(booking);
    
    // TRIGGER NOTIFICATION
    notificationService.create(
        booking.getUser().getEmail(),
        NotificationType.BOOKING_REJECTED,
        "Your booking for '" + booking.getResource().getName() + 
        "' on " + booking.getBookingDate() + " has been rejected.",
        "booking-" + booking.getId()
    );
    
    return rejectedBooking;
}
```

## 2. TICKET SERVICE INTEGRATION
# File: backend/src/main/java/backend/service/TicketService.java

# When ticket status changes, add:
```java
import backend.model.NotificationType;

// In TicketService class
private final NotificationService notificationService;

public TicketModel updateTicketStatus(Long ticketId, String newStatus) {
    TicketModel ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new RuntimeException("Ticket not found"));
    
    String oldStatus = ticket.getStatus();
    ticket.setStatus(newStatus);
    TicketModel updatedTicket = ticketRepository.save(ticket);
    
    // TRIGGER NOTIFICATION
    notificationService.create(
        ticket.getCreatedBy().getEmail(),
        NotificationType.TICKET_UPDATED,
        "Your ticket #" + ticket.getId() + " status has been updated from '" + 
        oldStatus + "' to '" + newStatus + "': " + ticket.getTitle(),
        "ticket-" + ticket.getId()
    );
    
    return updatedTicket;
}
```

## 3. COMMENT SERVICE INTEGRATION
# File: backend/src/main/java/backend/service/CommentService.java

# When comment is added to ticket, add:
```java
import backend.model.NotificationType;

// In CommentService class
private final NotificationService notificationService;

public CommentModel createComment(Long ticketId, CommentModel comment) {
    TicketModel ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new RuntimeException("Ticket not found"));
    
    comment.setTicket(ticket);
    CommentModel savedComment = commentRepository.save(comment);
    
    // TRIGGER NOTIFICATION to ticket creator
    if (!ticket.getCreatedBy().getEmail().equals(comment.getCreatedBy().getEmail())) {
        notificationService.create(
            ticket.getCreatedBy().getEmail(),
            NotificationType.COMMENT_ADDED,
            comment.getCreatedBy().getFullName() + " added a comment on ticket #" + 
            ticket.getId() + ": " + comment.getContent().substring(0, Math.min(50, comment.getContent().length())) + "...",
            "ticket-" + ticket.getId() + "-comment-" + savedComment.getId()
        );
    }
    
    return savedComment;
}
```

## 4. FRONTEND: CONDITIONAL USER MANAGEMENT ACCESS

# File: frontend/src/App.jsx or frontend/src/pages/Dashboard.jsx

```jsx
import UserManagement from './components/UserManagement/UserManagement';
import { useAuth } from './context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="dashboard">
      {user && user.role === 'ADMIN' && (
        <nav>
          {/* ... other nav items ... */}
          <Link to="/admin/users">User Management</Link>
        </nav>
      )}
    </div>
  );
}
```

## 5. PROTECTED ROUTE FOR USER MANAGEMENT

# File: frontend/src/components/ProtectedRoute.jsx

```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

## 6. ADD ROUTE IN APP.JS

# File: frontend/src/App.jsx

```jsx
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './components/UserManagement/UserManagement';

function App() {
  return (
    <Routes>
      {/* ... existing routes ... */}
      
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <UserManagement />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}
```

## 7. NOTIFICATION SETUP IN LAYOUT

# File: frontend/src/components/Layout.jsx

# NotificationPanel should already be in your layout header:
```jsx
import NotificationPanel from './Notifications/NotificationPanel';

function Layout({ children }) {
  return (
    <header className="header">
      <nav className="navbar">
        {/* ... other components ... */}
        <NotificationPanel />
      </nav>
    </header>
  );
}
```

---

# IMPLEMENTATION CHECKLIST

## Backend Setup
- [ ] Add NotificationService injection to BookingService
- [ ] Add NotificationService injection to TicketService
- [ ] Add NotificationService injection to CommentService
- [ ] Update BookingService.approveBooking() method
- [ ] Update BookingService.rejectBooking() method
- [ ] Update TicketService.updateTicketStatus() method
- [ ] Update CommentService.createComment() method
- [ ] Test all notification triggers

## Frontend Setup
- [ ] Verify NotificationPanel is in Layout
- [ ] Create/Update UserManagement route
- [ ] Create/Update ProtectedRoute component
- [ ] Add admin navigation link
- [ ] Test role-based access control
- [ ] Test notification panel UI

## Database
- [ ] Run database migrations (auto with JPA)
- [ ] Verify users table has role column
- [ ] Verify notifications table exists
- [ ] Create admin user account

## Testing
- [ ] Test booking approval notification
- [ ] Test booking rejection notification
- [ ] Test ticket status change notification
- [ ] Test comment notification
- [ ] Test notification deletion
- [ ] Test user role management
- [ ] Test access control

---

# IMPORTANT NOTES

1. All NotificationType values are predefined as enums
2. Use lowercase for enum values: NotificationType.BOOKING_APPROVED
3. recipientEmail must match user.email in database
4. JWT token must contain correct role claim
5. Frontend should refresh notifications every 30 seconds
6. Admin users are defined in application.properties: app.admin.emails

---

# EXAMPLE: COMPLETE BOOKING APPROVAL FLOW

## Backend Code
```java
@PostMapping("/{id}/approve")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
public ResponseEntity<BookingModel> approveBooking(@PathVariable Long id) {
    BookingModel booking = bookingService.approveBooking(id);
    // Notification is sent automatically by approveBooking()
    return ResponseEntity.ok(booking);
}
```

## Frontend Code
```jsx
async function handleApproveBooking(bookingId) {
  try {
    await BookingService.approveBooking(bookingId);
    // Notification appears automatically after 30 seconds
    // Or user can manually refresh notifications
    alert('Booking approved! User will receive notification.');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## User Experience
1. Admin approves booking in UI
2. Backend triggers notification creation
3. User's notification panel auto-refreshes
4. User sees "Booking Approved" notification
5. User can mark as read or delete

---

Generated: May 2026
For more information, see MODULES_D_E_IMPLEMENTATION.md
