# 🧪 Complete Testing Guide

## Maintenance & Incident Ticketing System - Full Test Suite

---

## 📋 Pre-Testing Checklist

Before running tests, ensure:

- [x] MySQL running and `maintenance_ticketing` database created
- [x] Backend running on http://localhost:8080
- [x] Frontend running on http://localhost:3000
- [x] No error messages in either terminal

---

## 🧪 Test Categories

### 1. Backend API Testing (using cURL or Postman)
### 2. Frontend Component Testing (manual browser testing)
### 3. Integration Testing (end-to-end workflow)
### 4. Performance Testing
### 5. Error Handling Testing

---

## 🔧 Backend API Tests

### Prerequisites for cURL Testing

**Windows:**
```bash
# Install curl (already installed in modern Windows)
curl --version
```

**Mac:**
```bash
brew install curl
```

**Linux:**
```bash
sudo apt-get install curl
```

---

### Test 1.1: Create Ticket

**Endpoint:** `POST /api/tickets`

**cURL Command:**
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Server Down",
    "description": "Main server not responding",
    "priority": "CRITICAL",
    "category": "Infrastructure",
    "location": "Data Center A",
    "reportedBy": "admin@company.com"
  }'
```

**Expected Response:**
```json
{
  "ticketId": "TKT-12345678",
  "title": "Server Down",
  "description": "Main server not responding",
  "priority": "CRITICAL",
  "category": "Infrastructure",
  "location": "Data Center A",
  "reportedBy": "admin@company.com",
  "status": "OPEN",
  "createdAt": "2024-04-02T10:30:00",
  "updatedAt": "2024-04-02T10:30:00"
}
```

**Status Code:** `201 Created`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.2: Get All Tickets

**Endpoint:** `GET /api/tickets`

**cURL Command:**
```bash
curl -X GET http://localhost:8080/api/tickets
```

**Expected Response:**
```json
[
  {
    "ticketId": "TKT-12345678",
    "title": "Server Down",
    "status": "OPEN",
    "priority": "CRITICAL",
    "category": "Infrastructure",
    "reportedBy": "admin@company.com",
    "createdAt": "2024-04-02T10:30:00"
  }
]
```

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.3: Filtering - Get Tickets by Status

**Endpoint:** `GET /api/tickets?status=OPEN`

**cURL Command:**
```bash
curl -X GET "http://localhost:8080/api/tickets?status=OPEN"
```

**Expected:** Only OPEN tickets returned

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.4: Filtering - Get Tickets by Priority

**Endpoint:** `GET /api/tickets?priority=CRITICAL`

**cURL Command:**
```bash
curl -X GET "http://localhost:8080/api/tickets?priority=CRITICAL"
```

**Expected:** Only CRITICAL tickets returned

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.5: Get Specific Ticket

**Endpoint:** `GET /api/tickets/{id}`

**cURL Command:** (Replace TKT-XXXXXXXX with actual ticket ID)
```bash
curl -X GET http://localhost:8080/api/tickets/TKT-12345678
```

**Expected Response:**
```json
{
  "ticketId": "TKT-12345678",
  "title": "Server Down",
  "description": "Main server not responding",
  "status": "OPEN",
  "priority": "CRITICAL",
  "category": "Infrastructure",
  "location": "Data Center A",
  "reportedBy": "admin@company.com",
  "assignedTo": null,
  "createdAt": "2024-04-02T10:30:00",
  "updatedAt": "2024-04-02T10:30:00",
  "resolvedAt": null,
  "comments": [],
  "attachments": []
}
```

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.6: Update Ticket Status

**Endpoint:** `PUT /api/tickets/{id}`

**cURL Command:**
```bash
curl -X PUT http://localhost:8080/api/tickets/TKT-12345678 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "assignedTo": "tech@company.com"
  }'
```

**Expected Response:** Updated ticket object

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.7: Add Comment

**Endpoint:** `POST /api/tickets/{id}/comments`

**cURL Command:**
```bash
curl -X POST http://localhost:8080/api/tickets/TKT-12345678/comments \
  -H "Content-Type: application/json" \
  -d '{
    "commentText": "Started investigating the issue",
    "commentedBy": "tech@company.com"
  }'
```

**Expected Response:**
```json
{
  "commentId": 1,
  "ticketId": "TKT-12345678",
  "commentText": "Started investigating the issue",
  "commentedBy": "tech@company.com",
  "createdAt": "2024-04-02T10:35:00"
}
```

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.8: Get Comments

**Endpoint:** `GET /api/tickets/{id}/comments`

**cURL Command:**
```bash
curl -X GET http://localhost:8080/api/tickets/TKT-12345678/comments
```

**Expected Response:** Array of comments

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.9: Edit Comment

**Endpoint:** `PUT /api/tickets/{id}/comments/{cid}`

**cURL Command:**
```bash
curl -X PUT http://localhost:8080/api/tickets/TKT-12345678/comments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "commentText": "Found the root cause - database connection timeout",
    "commentedBy": "tech@company.com"
  }'
```

**Expected Response:** Updated comment

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.10: Delete Comment

**Endpoint:** `DELETE /api/tickets/{id}/comments/{cid}`

**cURL Command:**
```bash
curl -X DELETE "http://localhost:8080/api/tickets/TKT-12345678/comments/1?commentedBy=tech@company.com"
```

**Expected Response:**
```json
{
  "message": "Comment deleted successfully"
}
```

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.11: Upload Attachment

**Endpoint:** `POST /api/tickets/{id}/attachments`

**cURL Command:** (requires image file)
```bash
curl -X POST http://localhost:8080/api/tickets/TKT-12345678/attachments \
  -F "files=@/path/to/image.jpg" \
  -F "uploadedBy=tech@company.com"
```

**Expected Response:**
```json
{
  "message": "Attachments uploaded successfully",
  "attachments": [
    {
      "attachmentId": 1,
      "fileName": "image.jpg",
      "filePath": "attachments/uuid-image.jpg",
      "fileType": "image/jpeg",
      "fileSize": 51200,
      "uploadedBy": "tech@company.com",
      "uploadedAt": "2024-04-02T10:40:00"
    }
  ]
}
```

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.12: Get Attachments

**Endpoint:** `GET /api/tickets/{id}/attachments`

**cURL Command:**
```bash
curl -X GET http://localhost:8080/api/tickets/TKT-12345678/attachments
```

**Expected Response:** Array of attachments

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.13: Delete Attachment

**Endpoint:** `DELETE /api/tickets/{id}/attachments/{aid}`

**cURL Command:**
```bash
curl -X DELETE http://localhost:8080/api/tickets/TKT-12345678/attachments/1
```

**Expected Response:**
```json
{
  "message": "Attachment deleted successfully"
}
```

**Status Code:** `200 OK`

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 1.14: Delete Ticket (Cascading Delete)

**Endpoint:** `DELETE /api/tickets/{id}`

**cURL Command:**
```bash
curl -X DELETE http://localhost:8080/api/tickets/TKT-12345678
```

**Expected Response:**
```json
{
  "message": "Ticket deleted successfully"
}
```

**Status Code:** `200 OK`

**Verify:** Comments and attachments also deleted

**Test Result:** ✅ PASS / ❌ FAIL

---

## 🌐 Frontend Component Tests

### Test 2.1: Home Page Navigation

**Steps:**
1. Open http://localhost:3000
2. Look for navigation bar
3. Verify 4 navigation links present
4. Check feature cards displayed
5. Review how-it-works section

**Expected:**
- ✅ Navigation bar visible
- ✅ "Home" link active
- ✅ "Create Ticket" clickable
- ✅ "All Tickets" clickable
- ✅ 6 feature cards displayed
- ✅ 4-step workflow visible

**Test Result:** ✅ PASS / ❌ FAIL

**Notes:**
```
_________________________________
[Home] [Create Ticket] [All Tickets]
_________________________________
```

---

### Test 2.2: Create Ticket Form

**Steps:**
1. Click "Create Ticket" button
2. Fill in form:
   - Title: "Test Ticket 001"
   - Description: "This is a test ticket"
   - Priority: Select "HIGH"
   - Category: Select "Software"
   - Location: "Office Building B"
   - Reporter Email: "test@company.com"
3. Click "Create Ticket" button
4. Wait for success message
5. Note the Ticket ID

**Expected:**
- ✅ Form loads without errors
- ✅ All fields visible
- ✅ Priority dropdown has 4 options (LOW, MEDIUM, HIGH, CRITICAL)
- ✅ Category dropdown has options
- ✅ Submit button clickable
- ✅ Redirect to ticket details page
- ✅ Ticket ID format: TKT-XXXXXXXX

**Test Result:** ✅ PASS / ❌ FAIL

**Captured Ticket ID:** `TKT-__________`

---

### Test 2.3: Ticket List Display

**Steps:**
1. Click "All Tickets" link
2. Observe ticket grid
3. Verify created ticket visible
4. Check search functionality
5. Test filtering options

**Expected:**
- ✅ Tickets displayed in card grid
- ✅ Each card shows: Title, Category, Status Badge, Priority Badge
- ✅ Search box working
- ✅ Status filter dropdown
- ✅ Priority filter dropdown
- ✅ Category filter working

**Search Test:**
- Type "Test Ticket 001" → Should filter to that ticket
- Clear search → Should show all tickets

**Filter Test:**
- Status = "OPEN" → Should show only open tickets
- Priority = "HIGH" → Should show only high priority tickets

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 2.4: Ticket Details View

**Steps:**
1. Click on any ticket from list
2. Verify details page loads
3. Check all information displayed
4. Review the 3 tabs

**Expected:**
- ✅ Ticket details page loads
- ✅ Ticket ID displayed
- ✅ Title and description visible
- ✅ Status, Priority badges shown
- ✅ 3 tabs visible: Details, Comments, Attachments
- ✅ Sidebar with ticket info
- ✅ Back button present

**Details Tab:**
- [ ] Description visible
- [ ] Category displayed
- [ ] Location shown
- [ ] Reporter email shown
- [ ] Created/Updated timestamps

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 2.5: Comments Functionality

**Steps:**
1. In ticket details, click "Comments" tab
2. Enter email: "commenter@company.com"
3. Enter comment: "This is a test comment"
4. Click "Add Comment" button
5. Verify comment appears
6. Add second comment
7. Try editing own comment
8. Try deleting own comment

**Expected:**
- ✅ Comments tab loads empty initially
- ✅ Comment form visible
- ✅ Comment posted successfully
- ✅ Comment appears in list with timestamp
- ✅ Delete button appears for own comments
- ✅ Can edit own comments
- ✅ Edit updates saved

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 2.6: File Upload

**Steps:**
1. In ticket details, click "Attachments" tab
2. Enter email: "uploader@company.com"
3. Select image file (PNG/JPG/GIF)
4. Click "Upload File" button
5. Verify file appears in grid
6. Try uploading 2nd and 3rd files
7. Try uploading 4th file (should fail)

**Expected:**
- ✅ Upload form visible
- ✅ File input accepts images only
- ✅ First upload successful
- ✅ Second upload successful
- ✅ Third upload successful
- ✅ Fourth upload shows error: "Maximum 3 attachments allowed"
- ✅ Upload status shows file name+size
- ✅ Delete button per file

**Test Files to Use:**
- test1.jpg (2 MB)
- test2.png (1.5 MB)
- test3.gif (3 MB)

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 2.7: Status Change

**Steps:**
1. In ticket details page
2. Observe "Status" dropdown in sidebar
3. Change from current status to "IN_PROGRESS"
4. Verify update
5. Change to "RESOLVED"
6. Verify update saves

**Expected:**
- ✅ Status dropdown visible
- ✅ Can select new status
- ✅ Page updates with new status
- ✅ Status badge color changes
- ✅ Updated timestamp refreshes

**Status Colors:**
- OPEN: Red
- IN_PROGRESS: Orange
- RESOLVED: Green
- CLOSED: Purple
- ON_HOLD: Teal

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 2.8: Responsive Design

**Steps:**
1. Test on Desktop (1920x1080)
2. Test on Tablet (768x1024)
3. Test on Mobile (375x667)
4. Use browser DevTools (F12)

**Expected:**
- ✅ Desktop: Multi-column layout
- ✅ Tablet: 2-column grid
- ✅ Mobile: Single column
- ✅ Navigation remains accessible
- ✅ Forms remain usable
- ✅ Text readable on all sizes

**Test Result:** ✅ PASS / ❌ FAIL

---

## 🔄 Integration Tests (End-to-End)

### Test 3.1: Complete Workflow

**Complete Ticket Lifecycle:**

1. ✅ **Create** ticket through frontend form
   - Verify API POST call succeeds
   - Verify ticket ID generated
   - Verify redirect to details page

2. ✅ **View** ticket in list
   - Verify ticket appears in grid
   - Verify search finds it
   - Verify filters work

3. ✅ **Add Comment** through frontend
   - Verify API POST call succeeds
   - Verify comment thread updates
   - Verify author attribution works

4. ✅ **Upload File** through frontend
   - Verify file sent to backend
   - Verify file stored on disk
   - Verify attachment metadata saved
   - Verify max 3 files enforced

5. ✅ **Change Status** through frontend
   - Verify status updates in DB
   - Verify UI reflects change
   - Verify timestamp updates

6. ✅ **Edit Comment** through frontend
   - Verify edit API call
   - Verify content updates
   - Verify timestamp updates

7. ✅ **Delete Comment** through frontend
   - Verify delete API call
   - Verify comment removed from UI
   - Verify API permission check (author only)

8. ✅ **Delete File** through frontend
   - Verify delete API call
   - Verify file removed from UI
   - Verify file deleted from disk

9. ✅ **Delete Ticket** through frontend
   - Verify delete API call
   - Verify comments cascaded deleted
   - Verify files cascaded deleted
   - Verify redirect to list

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 3.2: Multi-User Scenario

**Scenario: Multiple Users Interacting**

1. **User A** creates ticket: "Network Issue"
2. **User B** adds comment: "I'll investigate"
3. **User A** adds comment: "Urgent"
4. **User B** uploads screenshot
5. **User A** uploads log file
6. **User B** changes status: "IN_PROGRESS"
7. **User A** can see all changes

**Expected:**
- ✅ All comments visible to both users
- ✅ All files visible to both users
- ✅ Comments show correct author
- ✅ Status changes reflect immediately

**Test Tools:**
- Open in two browser windows
- Refresh one window after other makes change
- Verify consistency

**Test Result:** ✅ PASS / ❌ FAIL

---

## ⚠️ Error Handling Tests

### Test 4.1: Invalid Ticket ID

**Request:**
```bash
curl -X GET http://localhost:8080/api/tickets/TKT-INVALID
```

**Expected Response:** 404 Not Found
```json
{
  "error": "Ticket not found"
}
```

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 4.2: Database Connection Error

**Steps:**
1. Stop MySQL
2. Try to create ticket
3. Observe error handling

**Expected:**
- ✅ Graceful error message
- ✅ "Database connection failed"
- ✅ No system crash

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 4.3: File Upload Size Exceeded

**Steps:**
1. Try uploading file > 10MB
2. Observe error handling

**Expected:**
- ✅ Error message shown: "File too large"
- ✅ Upload prevented
- ✅ Form remains usable

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 4.4: Missing Required Fields

**Steps:**
1. Try creating ticket without title
2. Click Create
3. Observe validation

**Expected:**
- ✅ Error message: "Title is required"
- ✅ Form validation prevents submission
- ✅ Highlighted field

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 4.5: Unauthorized Comment Edit

**Steps:**
1. User A creates ticket
2. User B adds comment
3. User A tries to edit User B's comment

**Expected:**
- ✅ Edit button doesn't appear for non-author
- ✅ If forced: "Unauthorized" error
- ✅ Comment not modified

**Test Result:** ✅ PASS / ❌ FAIL

---

## 📊 Performance Tests

### Test 5.1: Create 100 Tickets

**Steps:**
1. Use API to create 100 tickets programmatically
2. Load ticket list in frontend
3. Measure load time and responsiveness

**Expected:**
- ✅ List loads within 2 seconds
- ✅ Search still responds quickly
- ✅ Scrolling smooth
- ✅ Filter operations < 500ms

**Performance Metrics:**
- Load Time: __________ seconds
- Search Time: __________ ms
- Filter Time: __________ ms

**Test Result:** ✅ PASS / ❌ FAIL

---

### Test 5.2: Large File Upload

**Steps:**
1. Upload 10MB file (max allowed)
2. Monitor upload progress
3. Verify successful completion

**Expected:**
- ✅ Upload completes successfully
- ✅ Progress indicator works
- ✅ File accessible after upload
- ✅ Response time < 5 seconds

**Test Result:** ✅ PASS / ❌ FAIL

---

## 📋 Test Summary Report

### Backend API Tests
| Test # | Test Name | Expected | Actual | Status |
|--------|-----------|----------|--------|--------|
| 1.1 | Create Ticket | 201 | _____ | ⓧ |
| 1.2 | Get All Tickets | 200 | _____ | ⓧ |
| 1.3 | Filter by Status | 200 | _____ | ⓧ |
| 1.4 | Filter by Priority | 200 | _____ | ⓧ |
| 1.5 | Get Ticket Details | 200 | _____ | ⓧ |
| 1.6 | Update Ticket | 200 | _____ | ⓧ |
| 1.7 | Add Comment | 200 | _____ | ⓧ |
| 1.8 | Get Comments | 200 | _____ | ⓧ |
| 1.9 | Edit Comment | 200 | _____ | ⓧ |
| 1.10 | Delete Comment | 200 | _____ | ⓧ |
| 1.11 | Upload Attachment | 200 | _____ | ⓧ |
| 1.12 | Get Attachments | 200 | _____ | ⓧ |
| 1.13 | Delete Attachment | 200 | _____ | ⓧ |
| 1.14 | Delete Ticket | 200 | _____ | ⓧ |

### Frontend Component Tests
| Test # | Component | Status |
|--------|-----------|--------|
| 2.1 | Home Page | ⓧ |
| 2.2 | Create Ticket | ⓧ |
| 2.3 | Ticket List | ⓧ |
| 2.4 | Ticket Details | ⓧ |
| 2.5 | Comments | ⓧ |
| 2.6 | File Upload | ⓧ |
| 2.7 | Status Change | ⓧ |
| 2.8 | Responsive | ⓧ |

### Integration Tests
| Test # | Scenario | Status |
|--------|----------|--------|
| 3.1 | Complete Workflow | ⓧ |
| 3.2 | Multi-User | ⓧ |

### Error Handling Tests
| Test # | Error Scenario | Status |
|--------|----------------|--------|
| 4.1 | Invalid ID | ⓧ |
| 4.2 | DB Connection | ⓧ |
| 4.3 | File Size | ⓧ |
| 4.4 | Missing Fields | ⓧ |
| 4.5 | Unauthorized | ⓧ |

### Performance Tests
| Test # | Scenario | Status |
|--------|----------|--------|
| 5.1 | 100 Tickets | ⓧ |
| 5.2 | 10MB Upload | ⓧ |

---

## 🎯 Overall Test Results

```
Total Tests: 33
Passed: _____ (___%)
Failed: _____ (___%)
Blocked: _____ (___%)

Status: [ ] ALL PASS  [ ] SOME FAIL  [ ] BLOCKED
```

---

## ✅ Sign-Off

**Tested By:** ___________________  
**Date:** ___________________  
**Environment:** Backend:8080 | Frontend:3000 | MySQL:3306  
**Verdict:** ☐ APPROVED  ☐ APPROVED WITH ISSUES  ☐ NOT APPROVED  

**Comments:**
```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

*Testing Guide Version: 1.0*  
*Last Updated: April 2, 2026*
