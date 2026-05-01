# Quick Start Guide - Modules D & E

## What Was Implemented

### ✅ Module D: Notifications
Full CRUD notification system with web UI panel, real-time updates, filtering, and deletion.

### ✅ Module E: Authentication & Authorization  
OAuth 2.0 login, JWT tokens, role-based access control (RBAC), and user management system.

---

## Quick Setup (5 Minutes)

### 1. Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Set admin emails (comma-separated)
app.admin.emails=your.email@gmail.com,another.admin@example.com

# JWT Configuration (already set, but verify)
app.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
app.jwt.expiration=86400000
```

### 2. Add Notification Triggers (Optional but Recommended)

In your **BookingService**, add to the approval method:
```java
notificationService.create(
    booking.getUser().getEmail(),
    NotificationType.BOOKING_APPROVED,
    "Your booking has been approved",
    "booking-" + booking.getId()
);
```

### 3. Frontend - Add User Management Route

Edit `frontend/src/App.jsx` and add:
```jsx
import UserManagement from './components/UserManagement/UserManagement';

// Inside your Routes:
<Route 
  path="/admin/users" 
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <UserManagement />
    </ProtectedRoute>
  } 
/>
```

### 4. Restart Backend
```bash
cd backend
mvn spring-boot:run
```

---

## User Roles & Permissions

| Role | Can Do |
|------|--------|
| USER | Create bookings/tickets, view notifications, mark read |
| ADMIN | Everything + manage users + change roles |
| TECHNICIAN | Update tickets, view all resources |
| MANAGER | Manage resources, approve/reject bookings |

---

## Using Notifications

### For Users
1. Click the **Bell icon** in header
2. See all notifications with:
   - Type badge (color-coded)
   - Message
   - Timestamp
3. **Filter** by "All" or "Unread"
4. **Mark as read** individually or all at once
5. **Delete** notifications

### For Developers - Create Notification
```java
@Autowired
private NotificationService notificationService;

// When something happens:
notificationService.create(
    "user@example.com",           // recipient email
    NotificationType.TICKET_UPDATED,  // type
    "Your ticket was updated",    // message
    "ticket-123"                  // reference ID
);
```

---

## Using User Management (Admin Only)

### Access User Management
1. Login as ADMIN user
2. Navigate to `/admin/users` or add link to your menu
3. See table of all users with:
   - Full name
   - Email
   - Current role (with color badge)
   - Join date
   - Actions (Edit/Delete)

### Change User Role
1. Click **Edit** button next to user
2. Select new role from dropdown
3. Click **Save**
4. User's permissions update immediately

### Delete User
1. Click **Delete** button
2. Confirm deletion
3. User removed from system

---

## Available Notification Types

```
BOOKING_APPROVED   - Booking was approved
BOOKING_REJECTED   - Booking was rejected
TICKET_CREATED     - New ticket created
TICKET_UPDATED     - Ticket status changed
COMMENT_ADDED      - New comment on ticket
```

---

## API Reference

### Get My Notifications
```
GET /api/notifications
```
Response:
```json
[
  {
    "id": 1,
    "recipientEmail": "user@example.com",
    "type": "BOOKING_APPROVED",
    "message": "Your booking has been approved",
    "referenceId": "booking-123",
    "isRead": false,
    "createdAt": "2026-05-01T10:30:00"
  }
]
```

### Mark All as Read
```
PATCH /api/notifications/mark-all-read
```

### Get User Management (Admin)
```
GET /api/users
Authorization: Bearer <jwt-token>
```

### Update User Role (Admin)
```
PUT /api/users/{userId}/role
Authorization: Bearer <jwt-token>

Body:
{
  "role": "ADMIN"
}
```

---

## Testing Checklist

- [ ] Login with Google (OAuth 2.0)
- [ ] View notification panel
- [ ] Mark notification as read
- [ ] Delete notification
- [ ] Access `/admin/users` (admin only)
- [ ] Change a user's role
- [ ] Try deleting a user
- [ ] Verify access denied for non-admins
- [ ] Test notification filtering
- [ ] Check unread count updates

---

## Troubleshooting

**Q: Notifications not appearing?**
- Ensure recipientEmail matches exact user email
- Check notificationService.create() is called
- Verify backend is running
- Refresh notification panel (auto-refreshes every 30s)

**Q: Can't access User Management?**
- Verify user has ADMIN role
- Check admin email in app.admin.emails
- Clear browser cache and login again

**Q: Role changes not working?**
- Ensure you have ADMIN role
- Verify JWT token is current (login again)
- Check console for validation errors

---

## File Locations

### Backend
- Controllers: `backend/src/main/java/backend/controller/`
- Services: `backend/src/main/java/backend/service/`
- Models: `backend/src/main/java/backend/model/`
- DTOs: `backend/src/main/java/backend/dto/`

### Frontend
- Components: `frontend/src/components/`
- Services: `frontend/src/services/`
- Styles: `frontend/src/components/styles/`

---

## Next Level: Customize Notifications

### Add Email Notifications
```java
// In NotificationService.create()
if (shouldSendEmail(type)) {
    emailService.send(recipientEmail, subject, body);
}
```

### Add WebSocket Real-Time Updates
```java
@PostMapping("/notifications")
public void notifyClients(NotificationEvent event) {
    messagingTemplate.convertAndSendToUser(
        event.getRecipientEmail(),
        "/notifications",
        event
    );
}
```

### Add Notification Scheduling
```java
notificationService.scheduleNotification(
    email,
    type,
    message,
    LocalDateTime.now().plusHours(1)
);
```

---

## Documentation Files

Detailed documentation available:
- 📄 **MODULES_D_E_IMPLEMENTATION.md** - Complete technical guide
- 📄 **INTEGRATION_GUIDE.md** - Step-by-step integration examples

---

## Support

For issues, check:
1. Backend logs: `backend/target/` or terminal output
2. Browser console: F12 → Console tab
3. Network tab: F12 → Network → API calls
4. Documentation files above

---

**Last Updated:** May 2026  
**Version:** 1.0  
**Status:** Production Ready ✅

**Questions?** Review the comprehensive documentation files or check the implementation code comments.
