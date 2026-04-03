# Maintenance & Incident Ticketing System API

## Overview
This is a complete backend API for a Maintenance & Incident Ticketing System built with Spring Boot 3.x. It provides comprehensive CRUD operations for tickets, comments, and image attachments.

## Database Configuration
- **Database Name**: `maintenance_ticketing`
- **Driver**: MySQL 8.0+
- **Username**: root
- **Password**: 20011003

**Make sure to create the database before running the application:**
```sql
CREATE DATABASE IF NOT EXISTS maintenance_ticketing DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## API Endpoints

### Base URL: `http://localhost:8080/api/tickets`

---

## 1. CREATE TICKET

**Endpoint**: `POST /api/tickets`

**Description**: Create a new incident ticket

**Request Body**:
```json
{
  "title": "System Down - Production Server",
  "description": "The production server is not responding",
  "priority": "CRITICAL",
  "reportedBy": "john.doe@company.com",
  "category": "Hardware Failure",
  "location": "Data Center - Rack A12"
}
```

**Response (201 Created)**:
```json
{
  "id": 1,
  "ticketId": "TKT-A1B2C3D4",
  "title": "System Down - Production Server",
  "description": "The production server is not responding",
  "status": "OPEN",
  "priority": "CRITICAL",
  "reportedBy": "john.doe@company.com",
  "assignedTechnician": null,
  "category": "Hardware Failure",
  "location": "Data Center - Rack A12",
  "createdAt": "2024-04-02T10:30:00",
  "updatedAt": "2024-04-02T10:30:00",
  "resolvedAt": null,
  "comments": [],
  "attachments": []
}
```

---

## 2. LIST TICKETS (with filters)

**Endpoint**: `GET /api/tickets`

**Description**: Get all tickets with optional filtering

**Query Parameters**:
- `status` (optional): OPEN, IN_PROGRESS, RESOLVED, CLOSED, ON_HOLD
- `priority` (optional): LOW, MEDIUM, HIGH, CRITICAL
- `assignedTechnician` (optional): Technician name/email
- `category` (optional): Category name
- `reportedBy` (optional): Reporter name/email

**Examples**:
```
GET /api/tickets                                    // Get all tickets
GET /api/tickets?status=OPEN                        // Get all open tickets
GET /api/tickets?priority=HIGH                      // Get high priority tickets
GET /api/tickets?status=OPEN&priority=CRITICAL      // Get open critical tickets
GET /api/tickets?assignedTechnician=smith           // Get tickets assigned to Smith
GET /api/tickets?reportedBy=john.doe@company.com    // Get tickets reported by user
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "ticketId": "TKT-A1B2C3D4",
    "title": "System Down - Production Server",
    "status": "OPEN",
    "priority": "CRITICAL",
    "reportedBy": "john.doe@company.com",
    "assignedTechnician": null,
    "category": "Hardware Failure",
    "createdAt": "2024-04-02T10:30:00"
  }
]
```

---

## 3. GET TICKET DETAILS

**Endpoint**: `GET /api/tickets/{id}`

**Description**: Get details of a specific ticket including comments and attachments

**Path Parameters**:
- `id` (required): Ticket ID

**Example**: `GET /api/tickets/1`

**Response (200 OK)**:
```json
{
  "id": 1,
  "ticketId": "TKT-A1B2C3D4",
  "title": "System Down - Production Server",
  "description": "The production server is not responding",
  "status": "OPEN",
  "priority": "CRITICAL",
  "reportedBy": "john.doe@company.com",
  "assignedTechnician": null,
  "category": "Hardware Failure",
  "location": "Data Center - Rack A12",
  "createdAt": "2024-04-02T10:30:00",
  "updatedAt": "2024-04-02T10:30:00",
  "resolvedAt": null,
  "comments": [
    {
      "id": 1,
      "commentedBy": "jane.smith@company.com",
      "commentText": "Checking the power supply",
      "createdAt": "2024-04-02T10:35:00",
      "updatedAt": "2024-04-02T10:35:00"
    }
  ],
  "attachments": [
    {
      "id": 1,
      "fileName": "server_logs.txt",
      "fileType": "text/plain",
      "fileSize": 1024,
      "uploadedBy": "john.doe@company.com",
      "uploadedAt": "2024-04-02T10:30:00"
    }
  ]
}
```

---

## 4. UPDATE TICKET

**Endpoint**: `PUT /api/tickets/{id}`

**Description**: Update ticket details, assign technician, change status, and optionally upload attachments

**Path Parameters**:
- `id` (required): Ticket ID

**Request** (multipart/form-data):
- `ticketData` (JSON):
```json
{
  "title": "System Down - Production Server [UPDATED]",
  "description": "The production server has been brought back online",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "assignedTechnician": "jane.smith@company.com",
  "category": "Hardware Failure",
  "location": "Data Center - Rack A12"
}
```
- `file` (optional): Image attachments (can upload multiple files, max 3 total)

**Example**:
```bash
curl -X PUT "http://localhost:8080/api/tickets/1" \
  -F "ticketData=@ticket.json" \
  -F "file=@image1.png" \
  -F "file=@image2.png"
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "ticketId": "TKT-A1B2C3D4",
  "status": "IN_PROGRESS",
  "assignedTechnician": "jane.smith@company.com",
  "updatedAt": "2024-04-02T11:00:00"
}
```

---

## 5. DELETE TICKET

**Endpoint**: `DELETE /api/tickets/{id}`

**Description**: Delete a ticket (ADMIN only). Automatically deletes all related comments and attachments.

**Path Parameters**:
- `id` (required): Ticket ID

**Example**: `DELETE /api/tickets/1`

**Response (200 OK)**:
```json
{
  "message": "Ticket with id 1 has been deleted successfully.",
  "success": "true"
}
```

---

## 6. ADD COMMENT

**Endpoint**: `POST /api/tickets/{id}/comments`

**Description**: Add a comment to a ticket

**Path Parameters**:
- `id` (required): Ticket ID

**Request Body**:
```json
{
  "commentedBy": "jane.smith@company.com",
  "commentText": "I've started investigating the issue. Power supply seems faulty."
}
```

**Response (201 Created)**:
```json
{
  "id": 2,
  "ticket": {
    "id": 1
  },
  "commentedBy": "jane.smith@company.com",
  "commentText": "I've started investigating the issue. Power supply seems faulty.",
  "createdAt": "2024-04-02T10:35:00",
  "updatedAt": "2024-04-02T10:35:00"
}
```

---

## 7. EDIT OWN COMMENT

**Endpoint**: `PUT /api/tickets/{id}/comments/{cid}`

**Description**: Edit a comment (only the comment author can edit)

**Path Parameters**:
- `id` (required): Ticket ID
- `cid` (required): Comment ID

**Request Body**:
```json
{
  "commentedBy": "jane.smith@company.com",
  "commentText": "I've started investigating the issue. Power supply and network cables seem faulty."
}
```

**Response (200 OK)**:
```json
{
  "id": 2,
  "commentedBy": "jane.smith@company.com",
  "commentText": "I've started investigating the issue. Power supply and network cables seem faulty.",
  "updatedAt": "2024-04-02T10:40:00"
}
```

---

## 8. DELETE OWN COMMENT

**Endpoint**: `DELETE /api/tickets/{id}/comments/{cid}`

**Description**: Delete a comment (only the comment author can delete)

**Path Parameters**:
- `id` (required): Ticket ID
- `cid` (required): Comment ID

**Query Parameters**:
- `commentedBy` (required): Author of the comment

**Example**: `DELETE /api/tickets/1/comments/2?commentedBy=jane.smith@company.com`

**Response (200 OK)**:
```json
{
  "message": "Comment with id 2 has been deleted successfully.",
  "success": "true"
}
```

---

## 9. UPLOAD ATTACHMENTS

**Endpoint**: `POST /api/tickets/{id}/attachments`

**Description**: Upload image attachments to a ticket (max 3 per ticket)

**Path Parameters**:
- `id` (required): Ticket ID

**Request** (multipart/form-data):
- `files`: Image files (PNG, JPG, JPEG, GIF, etc.) - max 3 files
- `uploadedBy`: User uploading the file

**Example**:
```bash
curl -X POST "http://localhost:8080/api/tickets/1/attachments" \
  -F "files=@server_image.png" \
  -F "files=@error_screenshot.jpg" \
  -F "uploadedBy=john.doe@company.com"
```

**Response (201 Created)**:
```json
{
  "message": "Attachments uploaded successfully",
  "attachmentsUploaded": 2,
  "attachments": [
    {
      "id": 1,
      "fileName": "server_image.png",
      "filePath": "a1b2c3d4_server_image.png",
      "fileType": "image/png",
      "fileSize": 2048,
      "uploadedBy": "john.doe@company.com",
      "uploadedAt": "2024-04-02T10:30:00"
    },
    {
      "id": 2,
      "fileName": "error_screenshot.jpg",
      "filePath": "e5f6g7h8_error_screenshot.jpg",
      "fileType": "image/jpeg",
      "fileSize": 1536,
      "uploadedBy": "john.doe@company.com",
      "uploadedAt": "2024-04-02T10:30:00"
    }
  ]
}
```

**Error Response (400 Bad Request)** - Max attachments exceeded:
```json
{
  "error": "Maximum 3 attachments allowed per ticket",
  "currentAttachments": 2,
  "maxAllowed": 3,
  "attemptedToAdd": 2
}
```

---

## 10. GET ATTACHMENTS

**Endpoint**: `GET /api/tickets/{id}/attachments`

**Description**: Get all attachments for a ticket

**Path Parameters**:
- `id` (required): Ticket ID

**Example**: `GET /api/tickets/1/attachments`

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "fileName": "server_image.png",
    "filePath": "a1b2c3d4_server_image.png",
    "fileType": "image/png",
    "fileSize": 2048,
    "uploadedBy": "john.doe@company.com",
    "uploadedAt": "2024-04-02T10:30:00"
  }
]
```

---

## 11. DELETE ATTACHMENT

**Endpoint**: `DELETE /api/tickets/{id}/attachments/{aid}`

**Description**: Delete an attachment from a ticket

**Path Parameters**:
- `id` (required): Ticket ID
- `aid` (required): Attachment ID

**Example**: `DELETE /api/tickets/1/attachments/1`

**Response (200 OK)**:
```json
{
  "message": "Attachment with id 1 has been deleted successfully.",
  "success": "true"
}
```

---

## 12. GET COMMENTS

**Endpoint**: `GET /api/tickets/{id}/comments`

**Description**: Get all comments for a ticket

**Path Parameters**:
- `id` (required): Ticket ID

**Example**: `GET /api/tickets/1/comments`

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "commentedBy": "jane.smith@company.com",
    "commentText": "I've started investigating the issue.",
    "createdAt": "2024-04-02T10:35:00",
    "updatedAt": "2024-04-02T10:35:00"
  }
]
```

---

## Ticket Status Enum

- `OPEN`: Newly created ticket
- `IN_PROGRESS`: Technician is working on it
- `RESOLVED`: Issue has been resolved
- `CLOSED`: Ticket is closed
- `ON_HOLD`: Ticket is on hold

---

## Ticket Priority Enum

- `LOW`: Non-urgent issues
- `MEDIUM`: Normal issues
- `HIGH`: Urgent issues
- `CRITICAL`: System-critical issues affecting operations

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```

### 403 Forbidden
```json
{
  "error": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "errorMessage": "Ticket with id 999 not found",
  "errorCode": "TICKET_NOT_FOUND"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred"
}
```

---

## CORS Configuration

The API is configured to accept requests from `http://localhost:3000` (React frontend).

**Allowed Origins**: `http://localhost:3000`

---

## File Upload Configuration

- **Max File Size**: 10MB
- **Max Request Size**: 10MB
- **Upload Directory**: `src/main/uploads/attachments/`
- **Max Attachments per Ticket**: 3

---

## Database Schema

### Tables Created Automatically

1. **tickets**: Main ticket records
2. **comments**: Comments on tickets (with foreign key to tickets)
3. **attachments**: File attachments (with foreign key to tickets)

---

## Example Usage Flow

### 1. Create a Ticket
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Printer not working",
    "description": "Office printer is not responding",
    "priority": "HIGH",
    "reportedBy": "user@company.com",
    "category": "Equipment",
    "location": "Office Building A"
  }'
```

### 2. Get Ticket Details
```bash
curl http://localhost:8080/api/tickets/1
```

### 3. Update Ticket (Assign & Change Status)
```bash
curl -X PUT http://localhost:8080/api/tickets/1 \
  -F "ticketData={\"status\":\"IN_PROGRESS\",\"assignedTechnician\":\"tech@company.com\"}" \
  -F "file=@photo.png"
```

### 4. Add Comment
```bash
curl -X POST http://localhost:8080/api/tickets/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "commentedBy": "tech@company.com",
    "commentText": "Checking the printer connection"
  }'
```

### 5. Upload Attachments
```bash
curl -X POST http://localhost:8080/api/tickets/1/attachments \
  -F "files=@error.png" \
  -F "uploadedBy=tech@company.com"
```

---

## Technologies Used

- **Framework**: Spring Boot 3.x (4.0.1)
- **Language**: Java 21
- **Database**: MySQL 8.0+
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Port**: 8080 (default)

---

## Running the Application

1. **Create the database**:
```sql
CREATE DATABASE IF NOT EXISTS maintenance_ticketing DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Update database credentials** in `application.properties` if needed

3. **Run the application**:
```bash
./mvnw spring-boot:run
```

4. **Access the API**: `http://localhost:8080/api/tickets`

---

## Notes

- All timestamps are in ISO 8601 format
- User authentication/authorization should be implemented based on your security requirements
- The system uses unique ticket IDs (TKT-XXXXXXXX) for tracking
- Comments and attachments are cascaded deleted when a ticket is deleted
- File uploads are stored in `src/main/uploads/attachments/` directory
