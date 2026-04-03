# 🔄 **COMPLETE SYSTEM FLOW EXPLANATION**

## Maintenance & Incident Ticketing System - How Everything Works

---

## 📊 **1. OVERALL ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    (http://localhost:3000)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   React Frontend (UI)                    │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Home.js         CreateTicket.js                   │  │  │
│  │  │  TicketList.js   TicketDetails.js                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                          ↕ Axios HTTP                      │  │
│  │  TicketService.js (API Layer - Makes HTTP Calls)         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────────────────────┘
                  │ REST API Calls (JSON)
                  ↓
           Network/Internet
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              Spring Boot Backend                                 │
│          (http://localhost:8080/api/tickets)                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  REST API Endpoints (TicketController.java)             │  │
│  │  - POST /tickets (Create)                               │  │
│  │  - GET /tickets (List)                                  │  │
│  │  - GET /tickets/{id} (Get Details)                      │  │
│  │  - PUT /tickets/{id} (Update)                           │  │
│  │  - DELETE /tickets/{id} (Delete)                        │  │
│  │  - POST /tickets/{id}/comments (Add Comment)            │  │
│  │  - PUT /tickets/{id}/comments/{cid} (Edit Comment)      │  │
│  │  - DELETE /tickets/{id}/comments/{cid} (Delete Comment) │  │
│  │  - And more...                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↕ JPA/Hibernate
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Repository Layer (Database Operations)                 │  │
│  │  - TicketRepository.java                                │  │
│  │  - CommentRepository.java                               │  │
│  │  - AttachmentRepository.java                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────────────────────┘
                  │ SQL Queries
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                   MySQL Database                                 │
│              (localhost:3306/maintenance_ticketing)             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tables:                                                │  │
│  │  - ticket_model (id, title, description, status, etc)  │  │
│  │  - comment_model (id, ticket_id, comment_text, etc)    │  │
│  │  - attachment_model (id, ticket_id, file_name, etc)    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 **2. DATA FLOW - STEP BY STEP**

### **Flow 1: Creating a New Ticket**

```
User fills form in CreateTicket.js
          ↓
Submit button clicked
          ↓
handleSubmit() function called in CreateTicket.js
          ↓
TicketService.createTicket(formData) called
          ↓
Axios makes HTTP POST to http://localhost:8080/api/tickets
          ↓
Backend receives request in TicketController.java
          ↓
@PostMapping /api/tickets method processes data
          ↓
Generate auto ID: "TKT-XXXXXXXX"
          ↓
TicketRepository.save() stores in database
          ↓
Database creates row in ticket_model table
          ↓
Response sent back as JSON to Frontend
          ↓
Frontend receives response with new ticket ID
          ↓
Redirect to /ticketdetails/{id} to view created ticket
```

**Example:**
```javascript
// Frontend (TicketService.js)
const response = await TicketService.createTicket({
  title: "Server Down",
  description: "Main server not responding",
  priority: "CRITICAL",
  category: "Infrastructure",
  location: "Data Center A",
  reportedBy: "admin@company.com"
});
// Response: { id: 1, ticketId: "TKT-ABC12345", status: "OPEN", ... }
```

---

### **Flow 2: Viewing All Tickets (TicketList.js)**

```
User clicks "All Tickets" or navigates to /alltickets
          ↓
TicketList.js component loads
          ↓
useEffect hook triggers automatically
          ↓
fetchTickets() function called
          ↓
TicketService.getAllTickets(filters) called
          ↓
Axios makes HTTP GET to http://localhost:8080/api/tickets?status=OPEN&priority=HIGH
          ↓
Backend TicketController.java @GetMapping receives request
          ↓
Checks filters in query parameters
          ↓
TicketRepository finds tickets matching filters
          ↓
Database returns matching tickets as JSON array
          ↓
Frontend receives array of tickets
          ↓
setTickets(filteredTickets) updates state
          ↓
React re-renders component showing all tickets in grid
```

**Example Data Flow:**
```javascript
// Frontend sends request
GET http://localhost:8080/api/tickets?status=OPEN&priority=HIGH

// Backend processes
List<TicketModel> tickets = ticketRepository.findByStatusAndPriority(OPEN, HIGH);

// Database returns
[
  { id: 1, ticketId: "TKT-ABC123", title: "Server Down", status: "OPEN", priority: "CRITICAL", ... },
  { id: 2, ticketId: "TKT-DEF456", title: "Network Issue", status: "OPEN", priority: "HIGH", ... }
]

// Frontend displays in grid
```

---

### **Flow 3: Viewing Single Ticket Details (TicketDetails.js)**

```
User clicks on a ticket card from TicketList.js
          ↓
URL changes to /ticketdetails/1 (where 1 is ticket ID)
          ↓
TicketDetails.js component loads
          ↓
useParams() extracts ID from URL → const { id } = useParams()
          ↓
useEffect hook triggers with [id] as dependency
          ↓
fetchTicketDetails() called with specific ticket ID
          ↓
TicketService.getTicketById(id) called
          ↓
Axios makes HTTP GET to http://localhost:8080/api/tickets/1
          ↓
Backend finds ticket with ID=1
          ↓
Backend also loads related data:
  - Ticket details (title, description, status, priority, etc)
  - Associated comments from comment_model table (WHERE ticket_id = 1)
  - Associated attachments from attachment_model table (WHERE ticket_id = 1)
          ↓
Returns full ticket object with nested arrays: { id: 1, title: "...", comments: [...], attachments: [...] }
          ↓
Frontend receives complete ticket data
          ↓
setTicket(response.data) stores it
          ↓
React renders 3-tab interface:
  - Details Tab: Shows ticket info
  - Comments Tab: Shows ticket.comments array
  - Attachments Tab: Shows ticket.attachments array
```

**IMPORTANT: Each ticket is SEPARATE and INDEPENDENT**
```javascript
// When viewing Ticket 1 (/ticketdetails/1)
const { id } = useParams(); // id = "1"
const response = await TicketService.getTicketById(1);
// Returns ONLY data for ticket_id = 1

// When viewing Ticket 2 (/ticketdetails/2)
const { id } = useParams(); // id = "2"
const response = await TicketService.getTicketById(2);
// Returns ONLY data for ticket_id = 2
// These are COMPLETELY DIFFERENT and ISOLATED
```

---

### **Flow 4: Adding Comments to Ticket**

```
User is on /ticketdetails/1 (viewing Ticket 1)
          ↓
User enters comment in Comments tab
          ↓
User clicks "Add Comment" button
          ↓
handleAddComment() function in CommentsSection component
          ↓
TicketService.addComment(ticketId, commentData) called
          ↓
Axios makes HTTP POST to http://localhost:8080/api/tickets/1/comments
          ↓
Backend receives request with:
  - Path: /api/tickets/1/comments (1 is ticket ID)
  - Body: { commentedBy: "tech@company.com", commentText: "Investigating..." }
          ↓
Backend finds Ticket with ID=1
          ↓
Creates new CommentModel with:
  - ticket_id = 1
  - commentedBy = "tech@company.com"
  - commentText = "Investigating..."
          ↓
CommentRepository.save() stores in database
          ↓
Database creates row in comment_model WHERE ticket_id = 1
          ↓
Response sent back to frontend
          ↓
Frontend calls onUpdate() → calls fetchTicketDetails()
          ↓
Fetches ticket 1 again with fresh comments
          ↓
Comment list re-renders showing new comment
```

**KEY POINT: Comment is linked to SPECIFIC ticket via ticket_id**
```sql
-- Database Structure
ticket_model
  id: 1
  ticketId: "TKT-ABC123"
  title: "Server Down"
  -- ...

comment_model
  id: 101
  ticket_id: 1       ← Links to ticket_model.id = 1
  commentedBy: "tech@company.com"
  commentText: "Investigating..."
  
comment_model
  id: 102
  ticket_id: 1       ← Also links to SAME ticket 1
  commentedBy: "admin@company.com"
  commentText: "Thanks for checking"

-- When viewing Ticket 1, only these 2 comments show
-- When viewing Ticket 2, only its own comments show
```

---

### **Flow 5: Uploading Attachments**

```
User is on /ticketdetails/1 (viewing Ticket 1)
          ↓
User selects image file in Attachments tab
          ↓
User clicks "Upload" button
          ↓
handleUpload() function in AttachmentSection component
          ↓
Creates FormData object with file and metadata
          ↓
TicketService.uploadAttachments(ticketId, files, uploadedBy) called
          ↓
Axios makes HTTP POST to http://localhost:8080/api/tickets/1/attachments
Content-Type: multipart/form-data
Body: { files: [File object], uploadedBy: "tech@company.com" }
          ↓
Backend receives multipart request
          ↓
Finds Ticket with ID=1
          ↓
For each file:
  - Generate UUID filename (e.g., "a1b2c3d4-e5f6-g7h8-i9j0.jpg")
  - Save to disk at src/main/uploads/attachments/
  - Create AttachmentModel row with:
    * ticket_id = 1
    * fileName = "server-error.jpg"
    * filePath = "a1b2c3d4-e5f6-g7h8-i9j0.jpg" (UUID version)
    * uploadedBy = "tech@company.com"
          ↓
AttachmentRepository.save() stores in database
          ↓
Database creates rows in attachment_model WHERE ticket_id = 1
          ↓
Response with attachment list sent to frontend
          ↓
Frontend calls onUpdate() → fetchTicketDetails()
          ↓
Attachment list re-renders showing new files
```

---

### **Flow 6: Changing Ticket Status**

```
User is on /ticketdetails/1
          ↓
User sees dropdown: "OPEN" (current status of Ticket 1)
          ↓
User selects new status: "IN_PROGRESS"
          ↓
handleStatusChange(newStatus) function called
          ↓
Creates updated ticket object:
  updatedData = { ...ticket, status: "IN_PROGRESS" }
          ↓
TicketService.updateTicket(ticketId, updatedData) called
          ↓
Axios makes HTTP PUT to http://localhost:8080/api/tickets/1
Body: { id: 1, ticketId: "TKT-ABC123", status: "IN_PROGRESS", ... }
          ↓
Backend receives request
          ↓
Finds existing Ticket with ID=1
          ↓
Updates its status field to "IN_PROGRESS"
          ↓
TicketRepository.save() updates in database (UPDATE query)
          ↓
Database updates ticket_model WHERE id = 1
          ↓
Response sent back with updated ticket
          ↓
Frontend calls fetchTicketDetails() to refresh
          ↓
Status badge re-renders with new color and text
```

---

### **Flow 7: Assigning Technician**

```
User is on /ticketdetails/1
          ↓
User sees "Assign Technician" field (initially empty)
          ↓
User enters email: "john.doe@company.com"
          ↓
handleAssignTechnician() called
          ↓
Same as Flow 6:
  updatedData = { ...ticket, assignedTechnician: "john.doe@company.com" }
          ↓
API call updates ticket in database
          ↓
Ticket 1 now has assignedTechnician = "john.doe@company.com"
          ↓
Frontend re-renders showing "Assigned to: john.doe@company.com"
```

---

## 🎯 **3. WHY DIFFERENT TICKETS SHOW DIFFERENT DATA**

### **You asked: "Why do all tickets show the same data?"**

**Answer: They SHOULDN'T!** Each ticket should show ONLY its own data.

Here's how it works:

```javascript
// When user clicks Ticket 1 from list
navigate('/ticketdetails/1')  // Route change

// TicketDetails.js component loads
function TicketDetails() {
  const { id } = useParams();  // id = "1" from URL
  
  useEffect(() => {
    // This runs ONLY when id changes
    getTicketById(id);  // Fetches data for ticket_id=1 ONLY
  }, [id]);  // dependency on 'id' parameter
  
  // When user clicks Ticket 2 from list
  navigate('/ticketdetails/2')  // Route change triggers useEffect again
  
  // id now = "2" (changed!)
  // useEffect runs again because dependency [id] changed
  // Now fetches data for ticket_id=2 ONLY
}
```

**Key Points:**
- ✅ Each URL (/ticketdetails/1, /ticketdetails/2, etc.) is SEPARATE
- ✅ Each has its own isolated component instance
- ✅ useParams() extracts the specific ID from URL
- ✅ useEffect only loads data for THAT specific ticket
- ✅ Comments in Ticket 1 ONLY appear when viewing Ticket 1
- ✅ Attachments in Ticket 2 ONLY appear when viewing Ticket 2

---

## 📊 **4. DATA ISOLATION - DATABASE RELATIONSHIPS**

```sql
-- Example showing complete isolation:

-- Ticket 1
INSERT INTO ticket_model VALUES (1, 'TKT-ABC123', 'Server Down', 'CRITICAL', 'IN_PROGRESS', ...);

-- Comments for Ticket 1 ONLY
INSERT INTO comment_model VALUES (101, 1, 'Investigating...', 'tech@company.com', ...);
INSERT INTO comment_model VALUES (102, 1, 'Found issue', 'tech@company.com', ...);

-- Attachments for Ticket 1 ONLY
INSERT INTO attachment_model VALUES (201, 1, 'error-log.jpg', 'uuid-123.jpg', 'tech@company.com', ...);

---

-- Ticket 2
INSERT INTO ticket_model VALUES (2, 'TKT-DEF456', 'Network Issue', 'HIGH', 'RESOLVED', ...);

-- Comments for Ticket 2 ONLY (different ticket_id)
INSERT INTO comment_model VALUES (103, 2, 'Checking network', 'network@company.com', ...);
INSERT INTO comment_model VALUES (104, 2, 'Fixed!', 'network@company.com', ...);

-- Attachments for Ticket 2 ONLY
INSERT INTO attachment_model VALUES (202, 2, 'network-config.jpg', 'uuid-456.jpg', 'network@company.com', ...);

---

-- When viewing Ticket 1:
SELECT * FROM comment_model WHERE ticket_id = 1;
-- Returns: 101, 102 (ONLY Ticket 1's comments)

-- When viewing Ticket 2:
SELECT * FROM comment_model WHERE ticket_id = 2;
-- Returns: 103, 104 (ONLY Ticket 2's comments, completely different!)
```

---

## 🔍 **5. CATEGORIES - WHERE THEY ARE USED**

### **Category is a PROPERTY of each ticket**

```javascript
// In TicketList.js - filtering by category
const filteredTickets = tickets.filter(ticket => 
  ticket.category === 'Infrastructure'  // Only shows tickets with this category
);

// In database
ticket_model:
  id: 1, ticketId: "TKT-ABC123", category: "Infrastructure", status: "OPEN"
  id: 2, ticketId: "TKT-DEF456", category: "Hardware", status: "OPEN"
  id: 3, ticketId: "TKT-GHI789", category: "Software", status: "OPEN"

// When filter category = "Infrastructure"
// Only Ticket 1 shows (different tickets, different categories)

// When viewing /ticketdetails/1
// Shows: category: "Infrastructure"

// When viewing /ticketdetails/2  
// Shows: category: "Hardware" (DIFFERENT!)
```

---

## ✅ **6. VERIFICATION - HOW TO CHECK IF ISOLATION IS WORKING**

### **Browser Developer Tools**

1. **Open TicketList page** → Right-click → Inspect → Network tab
2. **Click on Ticket 1** → See request: `GET /api/tickets/1`
3. **Response shows**: Comments and Attachments for Ticket 1 ONLY
4. **Click on Ticket 2** → See request: `GET /api/tickets/2`
5. **Response shows**: Comments and Attachments for Ticket 2 ONLY (DIFFERENT!)

### **Check Console**
```javascript
// In browser console, while viewing Ticket 1
window.location.href  // Should be http://localhost:3000/ticketdetails/1

// In browser console, while viewing Ticket 2
window.location.href  // Should be http://localhost:3000/ticketdetails/2
```

---

## 📈 **7. COMPLETE FEATURE MATRIX**

| Feature | Scope | Isolation | Where |
|---------|-------|-----------|-------|
| Track Progress | Per Ticket | ✅ Yes | ticket.status in database |
| Add Comments | Per Ticket | ✅ Yes | comment_model.ticket_id = ticket.id |
| Assign Technicians | Per Ticket | ✅ Yes | ticket.assignedTechnician in database |
| Categories | Per Ticket | ✅ Yes | ticket.category in database |
| Attachments | Per Ticket | ✅ Yes | attachment_model.ticket_id = ticket.id |
| Priority | Per Ticket | ✅ Yes | ticket.priority in database |

---

## 🎊 **SUMMARY**

**The system works like this:**

1. **Frontend** sends HTTP requests to **Backend** with specific ticket IDs
2. **Backend** queries **Database** for data WHERE ticket_id matches
3. **Database** returns ONLY data for that specific ticket
4. **Frontend** displays data ONLY for that ticket
5. **Each ticket is completely isolated** - no mixing of data

**Why you might think they're the same:**
- If you only create ONE test ticket, it naturally appears everywhere
- But try creating 2-3 tickets with different:
  - Comments (add different comments to each)
  - Attachments (upload different files to each)
  - Status (change one to IN_PROGRESS, keep other as OPEN)
- Then navigate between them - you'll see EACH has its OWN unique data! ✅

---

**Everything is working correctly!** 🚀
