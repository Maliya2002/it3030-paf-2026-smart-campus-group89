# API Testing Guide - Maintenance & Incident Ticketing System

This guide contains example cURL commands and request/response bodies for testing all API endpoints.

## Prerequisites

- Spring Boot application running on `http://localhost:8080`
- MySQL database `maintenance_ticketing` created
- cURL installed (or use Postman)

---

## Test Data Setup

### 1. Create Database
```sql
CREATE DATABASE IF NOT EXISTS maintenance_ticketing 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Load Sample Data (Optional)
```bash
mysql -u root -p20011003 maintenance_ticketing < TEST_DATA.sql
```

---

## 1. CREATE TICKET (POST /api/tickets)

### Request
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "System Outage - All Services Down",
    "description": "Complete system outage affecting all production services. Users unable to access the platform.",
    "priority": "CRITICAL",
    "reportedBy": "john.doe@company.com",
    "category": "Infrastructure",
    "location": "Primary Data Center"
  }'
```

### Expected Response (201 Created)
```json
{
  "id": 1,
  "ticketId": "TKT-8F7E6D5C",
  "title": "System Outage - All Services Down",
  "description": "Complete system outage affecting all production services. Users unable to access the platform.",
  "status": "OPEN",
  "priority": "CRITICAL",
  "reportedBy": "john.doe@company.com",
  "assignedTechnician": null,
  "category": "Infrastructure",
  "location": "Primary Data Center",
  "createdAt": "2024-04-02T10:30:00",
  "updatedAt": "2024-04-02T10:30:00",
  "resolvedAt": null,
  "comments": [],
  "attachments": []
}
```

---

## 2. LIST TICKETS (GET /api/tickets)

### Get All Tickets
```bash
curl -X GET http://localhost:8080/api/tickets
```

### Get Open Tickets
```bash
curl -X GET "http://localhost:8080/api/tickets?status=OPEN"
```

### Get Critical Priority Tickets
```bash
curl -X GET "http://localhost:8080/api/tickets?priority=CRITICAL"
```

### Get Tickets Assigned to Technician
```bash
curl -X GET "http://localhost:8080/api/tickets?assignedTechnician=jane.smith@company.com"
```

### Get Open AND Critical Tickets
```bash
curl -X GET "http://localhost:8080/api/tickets?status=OPEN&priority=CRITICAL"
```

### Expected Response (200 OK)
```json
[
  {
    "id": 1,
    "ticketId": "TKT-8F7E6D5C",
    "title": "System Outage - All Services Down",
    "description": "Complete system outage...",
    "status": "OPEN",
    "priority": "CRITICAL",
    "reportedBy": "john.doe@company.com",
    "assignedTechnician": null,
    "category": "Infrastructure",
    "location": "Primary Data Center",
    "createdAt": "2024-04-02T10:30:00",
    "updatedAt": "2024-04-02T10:30:00"
  }
]
```

---

## 3. GET TICKET DETAILS (GET /api/tickets/{id})

### Request
```bash
curl -X GET http://localhost:8080/api/tickets/1
```

### Expected Response (200 OK)
```json
{
  "id": 1,
  "ticketId": "TKT-8F7E6D5C",
  "title": "System Outage - All Services Down",
  "description": "Complete system outage affecting all production services. Users unable to access the platform.",
  "status": "OPEN",
  "priority": "CRITICAL",
  "reportedBy": "john.doe@company.com",
  "assignedTechnician": null,
  "category": "Infrastructure",
  "location": "Primary Data Center",
  "createdAt": "2024-04-02T10:30:00",
  "updatedAt": "2024-04-02T10:30:00",
  "resolvedAt": null,
  "comments": [
    {
      "id": 1,
      "commentedBy": "jane.smith@company.com",
      "commentText": "I'm starting the investigation now",
      "createdAt": "2024-04-02T10:35:00",
      "updatedAt": "2024-04-02T10:35:00"
    }
  ],
  "attachments": [
    {
      "id": 1,
      "fileName": "error_log.png",
      "filePath": "a1b2c3d4_error_log.png",
      "fileType": "image/png",
      "fileSize": 2048,
      "uploadedBy": "john.doe@company.com",
      "uploadedAt": "2024-04-02T10:30:00"
    }
  ]
}
```

### Error Response (404 Not Found)
```json
{
  "errorMessage": "Ticket with id 999 not found",
  "errorCode": "TICKET_NOT_FOUND"
}
```

---

## 4. UPDATE TICKET (PUT /api/tickets/{id})

### Request - Assign Technician and Change Status
```bash
curl -X PUT http://localhost:8080/api/tickets/1 \
  -F 'ticketData={
    "title": "System Outage - All Services Down",
    "description": "Complete system outage affecting all production services. Users unable to access the platform.",
    "status": "IN_PROGRESS",
    "priority": "CRITICAL",
    "assignedTechnician": "jane.smith@company.com",
    "category": "Infrastructure",
    "location": "Primary Data Center"
  }'
```

### Request - Update Status to Resolved
```bash
curl -X PUT http://localhost:8080/api/tickets/1 \
  -F 'ticketData={
    "status": "RESOLVED",
    "description": "System has been restored. All services back online."
  }'
```

### Request - Update with File Attachments
```bash
curl -X PUT http://localhost:8080/api/tickets/1 \
  -F 'ticketData={
    "status": "IN_PROGRESS",
    "assignedTechnician": "jane.smith@company.com"
  }' \
  -F 'file=@/path/to/error_screenshot.png' \
  -F 'file=@/path/to/system_log.jpg'
```

### Expected Response (200 OK)
```json
{
  "id": 1,
  "ticketId": "TKT-8F7E6D5C",
  "status": "IN_PROGRESS",
  "assignedTechnician": "jane.smith@company.com",
  "updatedAt": "2024-04-02T11:00:00"
}
```

---

## 5. DELETE TICKET (DELETE /api/tickets/{id})

### Request
```bash
curl -X DELETE http://localhost:8080/api/tickets/1
```

### Expected Response (200 OK)
```json
{
  "message": "Ticket with id 1 has been deleted successfully.",
  "success": "true"
}
```

### Error Response (404 Not Found)
```json
{
  "errorMessage": "Ticket with id 999 not found",
  "errorCode": "TICKET_NOT_FOUND"
}
```

---

## 6. ADD COMMENT (POST /api/tickets/{id}/comments)

### Request
```bash
curl -X POST http://localhost:8080/api/tickets/1/comments \
  -H "Content-Type: application/json" \
  -d '{
    "commentedBy": "jane.smith@company.com",
    "commentText": "I have started investigating the issue. Initial diagnostics show database connection timeout."
  }'
```

### Expected Response (201 Created)
```json
{
  "id": 1,
  "ticket": {
    "id": 1
  },
  "commentedBy": "jane.smith@company.com",
  "commentText": "I have started investigating the issue. Initial diagnostics show database connection timeout.",
  "createdAt": "2024-04-02T10:35:00",
  "updatedAt": "2024-04-02T10:35:00"
}
```

---

## 7. EDIT OWN COMMENT (PUT /api/tickets/{id}/comments/{cid})

### Request - Edit Your Own Comment
```bash
curl -X PUT http://localhost:8080/api/tickets/1/comments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "commentedBy": "jane.smith@company.com",
    "commentText": "I have started investigating. Database connection timeout confirmed. Restarting service now."
  }'
```

### Expected Response (200 OK)
```json
{
  "id": 1,
  "commentedBy": "jane.smith@company.com",
  "commentText": "I have started investigating. Database connection timeout confirmed. Restarting service now.",
  "createdAt": "2024-04-02T10:35:00",
  "updatedAt": "2024-04-02T10:40:00"
}
```

### Error Response (403 Forbidden) - Not Comment Author
```json
{}
HTTP Status: 403 Forbidden
```

### Error Response (404 Not Found)
```json
{
  "errorMessage": "Comment with id 999 not found",
  "errorCode": "COMMENT_NOT_FOUND"
}
```

---

## 8. DELETE OWN COMMENT (DELETE /api/tickets/{id}/comments/{cid})

### Request - Delete Your Own Comment
```bash
curl -X DELETE "http://localhost:8080/api/tickets/1/comments/1?commentedBy=jane.smith@company.com"
```

### Expected Response (200 OK)
```json
{
  "message": "Comment with id 1 has been deleted successfully.",
  "success": "true"
}
```

### Error Response (403 Forbidden) - Not Comment Author
```json
{}
HTTP Status: 403 Forbidden
```

---

## 9. UPLOAD ATTACHMENTS (POST /api/tickets/{id}/attachments)

### Request - Upload Single File
```bash
curl -X POST http://localhost:8080/api/tickets/1/attachments \
  -F "files=@/path/to/error_screenshot.png" \
  -F "uploadedBy=john.doe@company.com"
```

### Request - Upload Multiple Files (Max 3)
```bash
curl -X POST http://localhost:8080/api/tickets/1/attachments \
  -F "files=@/path/to/image1.png" \
  -F "files=@/path/to/image2.jpg" \
  -F "files=@/path/to/image3.gif" \
  -F "uploadedBy=john.doe@company.com"
```

### Expected Response (201 Created)
```json
{
  "message": "Attachments uploaded successfully",
  "attachmentsUploaded": 2,
  "attachments": [
    {
      "id": 1,
      "fileName": "error_screenshot.png",
      "filePath": "a1b2c3d4_error_screenshot.png",
      "fileType": "image/png",
      "fileSize": 2048,
      "uploadedBy": "john.doe@company.com",
      "uploadedAt": "2024-04-02T10:30:00"
    },
    {
      "id": 2,
      "fileName": "system_log.jpg",
      "filePath": "e5f6g7h8_system_log.jpg",
      "fileType": "image/jpeg",
      "fileSize": 3072,
      "uploadedBy": "john.doe@company.com",
      "uploadedAt": "2024-04-02T10:30:00"
    }
  ]
}
```

### Error Response (400 Bad Request) - Max Attachments Exceeded
```json
{
  "error": "Maximum 3 attachments allowed per ticket",
  "currentAttachments": 2,
  "maxAllowed": 3,
  "attemptedToAdd": 2
}
```

---

## 10. GET ATTACHMENTS (GET /api/tickets/{id}/attachments)

### Request
```bash
curl -X GET http://localhost:8080/api/tickets/1/attachments
```

### Expected Response (200 OK)
```json
[
  {
    "id": 1,
    "fileName": "error_screenshot.png",
    "filePath": "a1b2c3d4_error_screenshot.png",
    "fileType": "image/png",
    "fileSize": 2048,
    "uploadedBy": "john.doe@company.com",
    "uploadedAt": "2024-04-02T10:30:00"
  },
  {
    "id": 2,
    "fileName": "system_log.jpg",
    "filePath": "e5f6g7h8_system_log.jpg",
    "fileType": "image/jpeg",
    "fileSize": 3072,
    "uploadedBy": "john.doe@company.com",
    "uploadedAt": "2024-04-02T10:30:00"
  }
]
```

---

## 11. GET COMMENTS (GET /api/tickets/{id}/comments)

### Request
```bash
curl -X GET http://localhost:8080/api/tickets/1/comments
```

### Expected Response (200 OK)
```json
[
  {
    "id": 1,
    "commentedBy": "jane.smith@company.com",
    "commentText": "I have started investigating the issue.",
    "createdAt": "2024-04-02T10:35:00",
    "updatedAt": "2024-04-02T10:35:00"
  },
  {
    "id": 2,
    "commentedBy": "john.doe@company.com",
    "commentText": "Thank you for the quick response.",
    "createdAt": "2024-04-02T10:40:00",
    "updatedAt": "2024-04-02T10:40:00"
  }
]
```

---

## 12. DELETE ATTACHMENT (DELETE /api/tickets/{id}/attachments/{aid})

### Request
```bash
curl -X DELETE http://localhost:8080/api/tickets/1/attachments/1
```

### Expected Response (200 OK)
```json
{
  "message": "Attachment with id 1 has been deleted successfully.",
  "success": "true"
}
```

### Error Response (404 Not Found)
```json
{
  "errorMessage": "Attachment with id 999 not found",
  "errorCode": "ATTACHMENT_NOT_FOUND"
}
```

---

## Complete Test Workflow

Follow this workflow to fully test the application:

### Step 1: Create a Ticket
```bash
RESPONSE=$(curl -s -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Network Connectivity Issue",
    "description": "Unable to connect to corporate network",
    "priority": "HIGH",
    "reportedBy": "test.user@company.com",
    "category": "Network",
    "location": "Office Building"
  }')
echo $RESPONSE | jq '.id' > ticket_id.txt
```

### Step 2: View All Tickets
```bash
curl -s -X GET http://localhost:8080/api/tickets | jq '.'
```

### Step 3: Get Ticket Details
```bash
TICKET_ID=$(cat ticket_id.txt)
curl -s -X GET http://localhost:8080/api/tickets/$TICKET_ID | jq '.'
```

### Step 4: Add a Comment
```bash
TICKET_ID=$(cat ticket_id.txt)
curl -s -X POST http://localhost:8080/api/tickets/$TICKET_ID/comments \
  -H "Content-Type: application/json" \
  -d '{
    "commentedBy": "support.team@company.com",
    "commentText": "Investigating network connectivity issue"
  }' | jq '.'
```

### Step 5: Assign Technician & Change Status
```bash
TICKET_ID=$(cat ticket_id.txt)
curl -s -X PUT http://localhost:8080/api/tickets/$TICKET_ID \
  -F 'ticketData={
    "status": "IN_PROGRESS",
    "assignedTechnician": "tech.support@company.com"
  }' | jq '.'
```

### Step 6: Upload Attachments
```bash
TICKET_ID=$(cat ticket_id.txt)
# First, create a test image
convert -size 100x100 xc:red test_image.png
curl -s -X POST http://localhost:8080/api/tickets/$TICKET_ID/attachments \
  -F "files=@test_image.png" \
  -F "uploadedBy=support.team@company.com" | jq '.'
```

### Step 7: Get Comments
```bash
TICKET_ID=$(cat ticket_id.txt)
curl -s -X GET http://localhost:8080/api/tickets/$TICKET_ID/comments | jq '.'
```

### Step 8: Get Attachments
```bash
TICKET_ID=$(cat ticket_id.txt)
curl -s -X GET http://localhost:8080/api/tickets/$TICKET_ID/attachments | jq '.'
```

---

## Test Validation Checklist

- [ ] Create ticket with CRITICAL priority
- [ ] List all tickets
- [ ] Filter tickets by status OPEN
- [ ] Filter tickets by priority HIGH
- [ ] Get specific ticket details
- [ ] Update ticket to IN_PROGRESS
- [ ] Assign technician to ticket
- [ ] Add comment to ticket
- [ ] Add another comment
- [ ] Edit own comment
- [ ] Delete own comment
- [ ] Upload 1 attachment
- [ ] Upload 2 more attachments (total 3)
- [ ] Try uploading 4th attachment (should fail)
- [ ] Get all comments
- [ ] Get all attachments
- [ ] Delete an attachment
- [ ] Update ticket status to RESOLVED
- [ ] Update ticket status to CLOSED
- [ ] Delete ticket (should cascade delete comments and attachments)
- [ ] Try to get deleted ticket (should return 404)

---

## Troubleshooting

### Connection Refused
```
Error: Failed to connect to localhost:8080
Fix: Make sure Spring Boot application is running
```

### 404 Ticket Not Found
```
Error: "Ticket with id 1 not found"
Fix: Make sure you created a ticket first and use correct ID
```

### Max Attachments Exceeded
```
Error: "Maximum 3 attachments allowed per ticket"
Fix: Delete some attachments before uploading new ones
```

### Permission Denied (Edit/Delete Comment)
```
Error: 403 Forbidden
Fix: Make sure you're using the same email as comment author
```

---

## Performance Tips

1. Use filters to reduce response size
2. Batch operations where possible
3. Delete old resolved tickets periodically
4. Index frequently filtered columns
5. Monitor database connection pool

---

**Generated**: April 2, 2026  
**API Version**: 1.0  
**Status**: Ready for Testing
