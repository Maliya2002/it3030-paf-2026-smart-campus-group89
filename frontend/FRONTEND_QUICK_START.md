# React Frontend - Quick Start Guide

## ⚡ 30-Second Setup

### Prerequisites
- Node.js 16+ installed
- Backend running on http://localhost:8080

### Steps

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend**
   ```bash
   npm start
   ```

3. **Open Browser**
   ```
   http://localhost:3000
   ```

**Done!** 🎉

---

## 📁 What's New

### Components Added ✅
- `components/Home/Home.js` - Landing page
- `components/CreateTicket/CreateTicket.js` - Create form
- `components/TicketList/TicketList.js` - List & search
- `components/TicketDetails/TicketDetails.js` - Full details with comments & attachments

### Services Added ✅
- `services/TicketService.js` - API wrapper with Axios

### CSS Files Added ✅
- `components/styles/Home.css`
- `components/styles/CreateTicket.css`
- `components/styles/TicketList.css`
- `components/styles/TicketDetails.css`

### Updated Files ✅
- `App.js` - New routes for ticketing system
- `package.json` - Axios already included

---

## 🗺️ Routes

| URL | Component | Purpose |
|-----|-----------|---------|
| `/` | Home | Dashboard |
| `/createticket` | CreateTicket | New ticket form |
| `/alltickets` | TicketList | List with filters |
| `/ticketdetails/:id` | TicketDetails | Full view + comments/attachments |

---

## 🎨 UI Features

✅ **Home Page**
- Feature cards overview
- Navigation navbar
- How-it-works section

✅ **Create Ticket**
- Form validation
- Priority selector
- Category dropdown

✅ **Ticket List**
- Search functionality
- Multiple filters (status, priority, category)
- Color-coded badges
- Card grid layout

✅ **Ticket Details**
- 3 tabs: Details, Comments, Attachments
- Add/edit/delete comments
- Upload images (max 3)
- Change status
- View metadata

---

## 🔧 API Connection

**Backend URL**: `http://localhost:8080/api/tickets`

**Frontend File**: `src/services/TicketService.js`

All API calls handled automatically with Axios:
- Error handling ✅
- Response formatting ✅
- File upload support ✅

---

## 📦 Dependencies

Already included in `package.json`:
- ✅ react@19.2.3
- ✅ react-router-dom@7.11.0
- ✅ axios@1.13.2
- ✅ lucide-react@0.562.0

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Backend not found | Ensure backend runs on :8080 |
| Blank page | Clear cache, restart npm |
| Images not uploading | Check file size < 10MB |
| CORS error | CORS is configured on backend |

---

## 📊 File Count

- **React Components**: 4
- **CSS Files**: 4
- **Service Files**: 1
- **Total New Files**: 9

---

## ✅ Verification Checklist

Before using, verify:

- [ ] `npm install` completed successfully
- [ ] Backend running on http://localhost:8080
- [ ] `npm start` launches without errors
- [ ] Browser opens to http://localhost:3000
- [ ] Can navigate between pages
- [ ] Can create a ticket
- [ ] Can view all tickets with filters
- [ ] Can view ticket details
- [ ] Can add comment
- [ ] Can upload attachment

---

## 🚀 Next Steps

1. ✅ Start frontend: `npm start`
2. ✅ Test basic navigation
3. ✅ Create a test ticket
4. ✅ Add comment and attachment
5. ✅ Try filtering and searching

---

## 📞 API Endpoints Used

```
POST   /api/tickets                    - Create ticket
GET    /api/tickets                    - List tickets
GET    /api/tickets/{id}               - Get details
PUT    /api/tickets/{id}               - Update ticket
DELETE /api/tickets/{id}               - Delete ticket
POST   /api/tickets/{id}/comments      - Add comment
PUT    /api/tickets/{id}/comments/{cid}- Edit comment
DELETE /api/tickets/{id}/comments/{cid}- Delete comment
POST   /api/tickets/{id}/attachments   - Upload files
GET    /api/tickets/{id}/attachments   - Get attachments
DELETE /api/tickets/{id}/attachments/{aid} - Delete file
```

---

## 🎯 What Works

✅ Create new tickets  
✅ View all tickets  
✅ Search & filter tickets  
✅ View ticket details  
✅ Add comments  
✅ Edit own comments  
✅ Delete own comments  
✅ Upload attachments (max 3)  
✅ Delete attachments  
✅ Change ticket status  
✅ Assign technicians  
✅ Responsive design  

---

**Status: READY TO USE** 🎉

Start with `npm start` and enjoy!
