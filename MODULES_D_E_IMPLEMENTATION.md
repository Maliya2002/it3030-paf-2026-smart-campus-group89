# Module D & E Implementation Guide

## Overview
This document outlines the complete implementation of **Module D (Notifications)** and **Module E (Authentication & Authorization)** with full CRUD operations for the Smart Campus System.

---

## Module D: Notifications

### Features
- ✅ Notifications for booking approval/rejection
- ✅ Notifications for ticket status changes
- ✅ Notifications for new comments on tickets
- ✅ Web UI notification panel with real-time updates
- ✅ Mark notifications as read/unread
- ✅ Delete notifications
- ✅ Filter notifications by type
- ✅ Unread notification counter

### Backend Components

#### 1. Models
- **NotificationModel** (`backend/model/NotificationModel.java`)
  - Fields: id, recipientEmail, type, message, referenceId, isRead, createdAt
  - Auto-timestamps creation time
  - Tracks read status

- **NotificationType** enum
  - BOOKING_APPROVED
  - BOOKING_REJECTED
  - TICKET_CREATED
  - TICKET_UPDATED
  - COMMENT_ADDED

#### 2. Repository
- **NotificationRepository** (`backend/repository/NotificationRepository.java`)
  ```java
  - findByRecipientEmailOrderByCreatedAtDesc()
  - findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc()
  - findByRecipientEmailAndTypeOrderByCreatedAtDesc()
  - countByRecipientEmailAndIsReadFalse()
  ```

#### 3. Service Layer
- **NotificationService** (`backend/service/NotificationService.java`)
  
  **CRUD Operations:**
  - `create()` - Create new notification
  - `listByRecipient()` - Get all notifications
  - `listUnreadByRecipient()` - Get unread notifications
  - `listByRecipientAndType()` - Filter by type
  - `getUnreadCount()` - Get unread count
  - `getNotificationById()` - Get single notification
  - `markAsRead()` - Mark one as read
  - `markAllAsRead()` - Mark all as read
  - `deleteNotification()` - Delete single
  - `deleteAllByRecipient()` - Delete all

#### 4. REST Controller
- **NotificationController** (`backend/controller/NotificationController.java`)

  **Endpoints:**
  ```
  GET    /api/notifications               - List all notifications
  GET    /api/notifications?type=BOOKING_APPROVED - Filter by type
  GET    /api/notifications/unread        - List unread only
  GET    /api/notifications/unread/count  - Get unread count
  GET    /api/notifications/{id}          - Get single notification
  PATCH  /api/notifications/{id}/read     - Mark as read
  PATCH  /api/notifications/mark-all-read - Mark all as read
  DELETE /api/notifications/{id}          - Delete notification
  DELETE /api/notifications               - Delete all
  ```

#### 5. DTOs
- **NotificationDTO** - Response object with all fields
- **CreateNotificationRequest** - Request for creating notifications

### Frontend Components

#### 1. Enhanced NotificationPanel
- **File:** `frontend/src/components/Notifications/NotificationPanel.js`
- **Features:**
  - Real-time notification updates (refresh every 30 seconds)
  - Unread notification counter badge
  - Filter by type (All/Unread)
  - Mark single/all as read
  - Delete single/all notifications
  - Notification type badges with color coding
  - Timestamp display
  - Loading states

#### 2. Styling
- **File:** `frontend/src/components/styles/NotificationPanel.css`
- **Features:**
  - Responsive design
  - Color-coded notification types
  - Smooth animations and transitions
  - Mobile-friendly layout

#### 3. Service
- **File:** `frontend/src/services/NotificationService.js`
- Updated with all CRUD methods

### Usage Examples

**Backend - Create Notification:**
```java
notificationService.create(
  "user@example.com",
  NotificationType.BOOKING_APPROVED,
  "Your booking has been approved",
  "booking-123"
);
```

**Frontend - Get Unread:**
```javascript
const unread = await NotificationService.getUnreadNotifications();
```

---

## Module E: Authentication & Authorization

### Features
- ✅ OAuth 2.0 login (Google Sign-in)
- ✅ JWT-based authentication
- ✅ Multiple user roles: USER, ADMIN, TECHNICIAN, MANAGER
- ✅ Role-based access control (RBAC)
- ✅ User management CRUD
- ✅ Protected API endpoints
- ✅ Frontend route protection

### Backend Components

#### 1. User Model & Roles
- **UserModel** (`backend/model/UserModel.java`)
  - Fields: id, fullName, email, role, createdAt
  - Auto-set default role (USER)

- **UserRole** enum
  ```
  USER       - Regular users (booking, ticket creation)
  ADMIN      - System administrators (user management)
  TECHNICIAN - Technical staff (ticket updates)
  MANAGER    - Management staff (resource management)
  ```

#### 2. User Service
- **UserService** (`backend/service/UserService.java`)
  
  **CRUD Operations:**
  - `getAllUsers()` - List all users
  - `getUserById()` - Get user by ID
  - `getUserByEmail()` - Get user by email
  - `getUsersByRole()` - Filter by role
  - `updateUserRole()` - Change user role
  - `deleteUser()` - Remove user

#### 3. User Repository
- **UserRepository** extended with:
  ```java
  - findByEmail()
  - findByRole()
  ```

#### 4. REST Controllers

**AuthController** (`backend/controller/AuthController.java`)
```
POST   /api/auth/google    - Google OAuth login
GET    /api/auth/me        - Get current user info
```

**UserController** (`backend/controller/UserController.java`)
```
GET    /api/users                - List all users (ADMIN)
GET    /api/users/{id}           - Get user by ID
GET    /api/users/email/{email}  - Get user by email
GET    /api/users/role/{role}    - Filter by role (ADMIN)
PUT    /api/users/{id}/role      - Update role (ADMIN)
DELETE /api/users/{id}           - Delete user (ADMIN)
```

#### 5. Security Configuration
- **SecurityConfig** (`backend/security/SecurityConfig.java`)
  - Enables method-level security with `@EnableMethodSecurity`
  - Configures URL-based access control
  - JWT token validation
  - Session-less authentication
  - CORS configuration

#### 6. DTOs
- **UserDTO** - User response object
- **UpdateUserRoleRequest** - Role update request
- **AuthResponse** - Login response

### Security Rules

**By HTTP Method:**
- `GET /api/**` - All authenticated users + TECHNICIAN/MANAGER
- `POST /api/tickets/**` - USER, ADMIN, TECHNICIAN, MANAGER
- `POST /api/bookings/**` - USER, ADMIN
- `PUT /api/tickets/**` - USER, ADMIN, TECHNICIAN
- `DELETE /api/tickets/**` - USER, ADMIN
- `POST /api/resources` - ADMIN, MANAGER
- `PUT /api/resources/**` - ADMIN, MANAGER
- `DELETE /api/resources/**` - ADMIN, MANAGER

**Notifications:**
- All authenticated users can access: GET, PATCH, DELETE

**Users (Management):**
- `GET /api/users` - ADMIN only
- `PUT /api/users/{id}/role` - ADMIN only
- `DELETE /api/users/{id}` - ADMIN only

### Frontend Components

#### 1. User Management
- **File:** `frontend/src/components/UserManagement/UserManagement.js`
- **Features:**
  - View all users with pagination
  - Filter by role
  - Edit user roles
  - Delete users
  - User count per role
  - Admin-only component

#### 2. Styling
- **File:** `frontend/src/components/styles/UserManagement.css`
- **Features:**
  - Professional table layout
  - Role-based color coding
  - Responsive design
  - Interactive edit/delete buttons

#### 3. User Service
- **File:** `frontend/src/services/UserService.js`
- All CRUD operations for user management

### Usage Examples

**Backend - Check Authority:**
```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<UserDTO>> getAllUsers() { }

@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public ResponseEntity<Void> createBooking() { }
```

**Frontend - Access Control:**
```javascript
// Conditional rendering based on role
const userRole = getCurrentUserRole();
if (userRole === 'ADMIN') {
  return <UserManagement />;
}
```

---

## Integration Guide

### 1. Setup Application Properties
```properties
# JWT Configuration
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000

# Admin Emails
app.admin.emails=admin@example.com,manager@example.com
```

### 2. Database Schema
The following tables are auto-created with JPA:
- `users` - User information and roles
- `notifications` - User notifications

### 3. Trigger Notifications

**On Booking Approval:**
```java
notificationService.create(
  booking.getUser().getEmail(),
  NotificationType.BOOKING_APPROVED,
  "Your booking for " + resource.getName() + " has been approved",
  "booking-" + booking.getId()
);
```

**On Ticket Status Change:**
```java
notificationService.create(
  ticket.getCreatedBy().getEmail(),
  NotificationType.TICKET_UPDATED,
  "Ticket status updated to: " + newStatus,
  "ticket-" + ticket.getId()
);
```

### 4. Frontend Integration

**Add UserManagement Route (Optional):**
```jsx
// In App.jsx
import UserManagement from './components/UserManagement/UserManagement';

<Route 
  path="/admin/users" 
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <UserManagement />
    </ProtectedRoute>
  } 
/>
```

**Use Enhanced Notifications:**
```jsx
// Already integrated in NotificationPanel
<NotificationPanel />
```

---

## Security Best Practices

1. ✅ JWT tokens are validated on every request
2. ✅ CORS is configured to allow frontend origin only
3. ✅ Role-based access control at endpoint level
4. ✅ Method-level security with @PreAuthorize
5. ✅ Sensitive data is not exposed in responses
6. ✅ Session-less stateless authentication

---

## Testing

### Manual Testing Checklist

**Notifications:**
- [ ] Create a ticket and verify notification is sent
- [ ] Mark notification as read
- [ ] Filter notifications by type
- [ ] Delete a notification
- [ ] Delete all notifications
- [ ] Verify unread count updates

**Authentication & Authorization:**
- [ ] Login with Google account
- [ ] Verify user role is assigned
- [ ] Access admin-only endpoints as ADMIN
- [ ] Verify access denied for non-admin users
- [ ] Update user role and verify changes
- [ ] Delete user account

---

## API Documentation

### Notification Endpoints

| Method | Endpoint | Auth | Role Required |
|--------|----------|------|---------------|
| GET | `/api/notifications` | Required | USER+ |
| GET | `/api/notifications/unread` | Required | USER+ |
| GET | `/api/notifications/unread/count` | Required | USER+ |
| GET | `/api/notifications/{id}` | Required | USER+ |
| PATCH | `/api/notifications/{id}/read` | Required | USER+ |
| PATCH | `/api/notifications/mark-all-read` | Required | USER+ |
| DELETE | `/api/notifications/{id}` | Required | USER+ |
| DELETE | `/api/notifications` | Required | USER+ |

### User Management Endpoints

| Method | Endpoint | Auth | Role Required |
|--------|----------|------|---------------|
| GET | `/api/users` | Required | ADMIN |
| GET | `/api/users/{id}` | Required | USER+ |
| GET | `/api/users/email/{email}` | Required | USER+ |
| GET | `/api/users/role/{role}` | Required | ADMIN |
| PUT | `/api/users/{id}/role` | Required | ADMIN |
| DELETE | `/api/users/{id}` | Required | ADMIN |

---

## Troubleshooting

### Issue: Notifications not appearing
- Check if recipientEmail is correct and matches user email in database
- Verify notificationService.create() is being called
- Check browser console for API errors

### Issue: User roles not updating
- Verify user has ADMIN role
- Check JWT token contains correct role
- Restart backend service if cached

### Issue: Google OAuth not working
- Verify Google Client ID is correct in environment
- Check CORS configuration allows frontend origin
- Verify redirect URI matches configuration

---

## Future Enhancements

- [ ] Email notifications integration
- [ ] Push notifications (WebSocket/Server-Sent Events)
- [ ] Notification scheduling
- [ ] Advanced notification templates
- [ ] Two-factor authentication
- [ ] User preferences for notification types
- [ ] Audit logging
- [ ] Role hierarchy and permissions matrix

---

## Files Modified/Created

### Backend
- ✅ `UserRole.java` - Added TECHNICIAN, MANAGER roles
- ✅ `UserModel.java` - Existing model used
- ✅ `NotificationModel.java` - Existing model used
- ✅ `UserService.java` - NEW
- ✅ `UserController.java` - NEW
- ✅ `UserRepository.java` - Enhanced
- ✅ `NotificationRepository.java` - Enhanced
- ✅ `NotificationService.java` - Enhanced
- ✅ `NotificationController.java` - Enhanced
- ✅ `SecurityConfig.java` - Enhanced with @EnableMethodSecurity
- ✅ `UserDTO.java` - NEW
- ✅ `UpdateUserRoleRequest.java` - NEW
- ✅ `NotificationDTO.java` - NEW
- ✅ `CreateNotificationRequest.java` - NEW

### Frontend
- ✅ `NotificationService.js` - Enhanced
- ✅ `NotificationPanel.js` - Enhanced
- ✅ `UserService.js` - NEW
- ✅ `UserManagement.js` - NEW
- ✅ `NotificationPanel.css` - NEW
- ✅ `UserManagement.css` - NEW

---

## Support

For issues or questions, refer to:
- Spring Security Documentation: https://spring.io/projects/spring-security
- React Documentation: https://react.dev
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

---

**Implementation Date:** May 2026
**Version:** 1.0
**Status:** Complete ✅
