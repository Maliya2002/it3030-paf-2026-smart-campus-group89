# ✅ MAINTENANCE & INCIDENT TICKETING SYSTEM - READY TO USE

## Quick Start (3 Steps)

### Step 1: Create Database
```sql
CREATE DATABASE IF NOT EXISTS maintenance_ticketing 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Start Application
```bash
cd backend
./mvnw spring-boot:run
```

### Step 3: Test API
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Network Down",
    "description": "Production network is offline",
    "priority": "CRITICAL",
    "reportedBy": "admin@company.com",
    "category": "Infrastructure",
    "location": "Data Center"
  }'
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `API_DOCUMENTATION.md` | Complete API reference with all endpoints |
| `PROJECT_STRUCTURE.md` | Project overview and file structure |
| `API_TESTING_GUIDE.md` | cURL examples and testing workflow |
| `TEST_DATA.sql` | Sample data for testing |
| `IMPLEMENTATION_SUMMARY.md` | Detailed implementation overview |

---

## ✅ 12 Endpoints Implemented

### Required (10 endpoints)
1. `POST /api/tickets` - Create ticket
2. `GET /api/tickets` - List with filters
3. `GET /api/tickets/{id}` - Get details
4. `PUT /api/tickets/{id}` - Update ticket
5. `DELETE /api/tickets/{id}` - Delete ticket
6. `POST /api/tickets/{id}/comments` - Add comment
7. `PUT /api/tickets/{id}/comments/{cid}` - Edit comment
8. `DELETE /api/tickets/{id}/comments/{cid}` - Delete comment
9. `POST /api/tickets/{id}/attachments` - Upload (max 3)

### Bonus (3 endpoints)
10. `GET /api/tickets/{id}/attachments` - Get attachments
11. `GET /api/tickets/{id}/comments` - Get comments
12. `DELETE /api/tickets/{id}/attachments/{aid}` - Delete attachment

---

## 🎯 Features

✅ CRUD operations for tickets, comments, attachments  
✅ Advanced filtering by status, priority, technician, category  
✅ Automatic ticket ID generation (TKT-XXXXXXXX)  
✅ File upload support (max 3 per ticket)  
✅ Comment threading with author permissions  
✅ Status tracking (OPEN, IN_PROGRESS, RESOLVED, CLOSED, ON_HOLD)  
✅ Priority levels (LOW, MEDIUM, HIGH, CRITICAL)  
✅ Timestamp tracking (created, updated, resolved)  
✅ Cascading deletion  
✅ Comprehensive error handling  

---

## 📊 Database

**Database Name**: `maintenance_ticketing`

**Tables**:
- `tickets` - Main ticket records
- `comments` - Comments on tickets
- `attachments` - File attachments

---

## 🔍 File Locations

### Models (`src/main/java/backend/model/`)
- TicketModel.java
- CommentModel.java
- AttachmentModel.java
- TicketStatus.java
- TicketPriority.java

### Repositories (`src/main/java/backend/repository/`)
- TicketRepository.java
- CommentRepository.java
- AttachmentRepository.java

### Controller (`src/main/java/backend/controller/`)
- TicketController.java (12 endpoints)

### Exceptions (`src/main/java/backend/exception/`)
- TicketNotFoundException.java & TicketNotFoundAdvice.java
- CommentNotFoundException.java & CommentNotFoundAdvice.java
- AttachmentNotFoundException.java & AttachmentNotFoundAdvice.java

### Configuration (`src/main/resources/`)
- application.properties

---

## 📋 Filter Examples

```bash
# Get all open tickets
GET /api/tickets?status=OPEN

# Get all critical priority tickets
GET /api/tickets?priority=CRITICAL

# Get tickets assigned to technician
GET /api/tickets?assignedTechnician=jane.smith@company.com

# Get open AND critical tickets
GET /api/tickets?status=OPEN&priority=CRITICAL

# Get all tickets in a category
GET /api/tickets?category=Infrastructure
```

---

## 🔐 Security Features

✅ CORS configured for http://localhost:3000  
✅ File upload validation (max 3 files, 10MB total)  
✅ Author-based permissions (edit/delete own comments)  
✅ Automatic cascading deletion  

*For production, add authentication/authorization*

---

## 🚀 Technologies

- Spring Boot 3.x (4.0.1)
- Java 21
- MySQL 8.0+
- JPA/Hibernate
- Maven

---

## ✨ What's Different from Inventory System

| Aspect | Inventory | Ticketing |
|--------|-----------|-----------|
| Main Entity | InventoryModel | TicketModel |
| Database | `spring` | `maintenance_ticketing` |
| Endpoints | 5 | 12 |
| Comments | ❌ | ✅ |
| Attachments | 1 image | Up to 3 images |
| Status Tracking | ❌ | ✅ OPEN, IN_PROGRESS, RESOLVED, CLOSED, ON_HOLD |
| Priority | ❌ | ✅ LOW, MEDIUM, HIGH, CRITICAL |
| Technician Assignment | ❌ | ✅ |
| Filtering | ❌ | ✅ Multiple filters |

---

## 🧪 Testing

### Quick Test
```bash
curl -X POST http://localhost:8080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test ticket","priority":"HIGH","reportedBy":"test@company.com","category":"Test","location":"Lab"}'
```

### Next Steps
1. Load TEST_DATA.sql for sample data
2. Follow API_TESTING_GUIDE.md for comprehensive test cases
3. Test each endpoint and filter combination

---

## 📞 Quick Reference

| Task | Endpoint | Method |
|------|----------|--------|
| Create Ticket | /api/tickets | POST |
| List Tickets | /api/tickets | GET |
| Get Ticket | /api/tickets/{id} | GET |
| Update Ticket | /api/tickets/{id} | PUT |
| Delete Ticket | /api/tickets/{id} | DELETE |
| Add Comment | /api/tickets/{id}/comments | POST |
| Edit Comment | /api/tickets/{id}/comments/{cid} | PUT |
| Delete Comment | /api/tickets/{id}/comments/{cid} | DELETE |
| Upload Files | /api/tickets/{id}/attachments | POST |
| Get Attachments | /api/tickets/{id}/attachments | GET |
| Get Comments | /api/tickets/{id}/comments | GET |
| Delete Attachment | /api/tickets/{id}/attachments/{aid} | DELETE |

---

## ⚡ Performance Tips

- Use filters to reduce response size
- Index frequently filtered columns (status, priority)
- Archive closed tickets periodically
- Monitor database connection pool
- Cache frequently accessed data

---

## 📝 Notes

- All timestamps in ISO 8601 format
- Unique ticket IDs auto-generated (TKT-XXXXXXXX)
- File uploads stored in `src/main/uploads/attachments/`
- Max file size: 10MB per file, 10MB per request
- Cascading deletes: deleting ticket removes comments & attachments

---

## ✅ Verification

Before submission, confirm:
- [ ] Database created
- [ ] App runs without errors
- [ ] All 12 endpoints working
- [ ] Filters work correctly
- [ ] Max 3 attachments enforced
- [ ] Comments/attachments cascade delete
- [ ] No inventory code remaining
- [ ] No user management code remaining

---

**Status**: ✅ **COMPLETE & READY**

**All 10 required endpoints + 2 bonus endpoints implemented**

For detailed information, see the documentation files in the `backend/` directory.
