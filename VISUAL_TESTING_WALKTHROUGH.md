# 🎬 **VISUAL STEP-BY-STEP TESTING WALKTHROUGH**

## How Your UI Should Look During Testing

---

## **PART 1: CREATING TEST TICKETS**

### Step 1: Click "Create Tickets" Button
```
You see the Create Ticket form with these fields:

┌─────────────────────────────────┐
│   CREATE NEW TICKET FORM        │
├─────────────────────────────────┤
│                                 │
│  Title: [_____________]         │
│                                 │
│  Description: [____________     │
│                ______________]  │
│                                 │
│  Priority: [Dropdown ▼]         │
│            (Select: CRITICAL)   │
│                                 │
│  Category: [Dropdown ▼]         │
│            (Select: Infrastructure) │
│                                 │
│  Location: [_____________]      │
│                                 │
│  Reporter Email: [_____________] │
│                                 │
│  [Create Ticket Button]         │
│  [Cancel Button]                │
└─────────────────────────────────┘
```

### Step 2: Fill Out TICKET 1
```
Title: "Server Down - Database Offline"
Description: "Critical server not responding"
Priority: CRITICAL (Red)
Category: Infrastructure
Location: Data Center A
Reporter Email: admin@company.com

[Click "Create Ticket Button"]
```

### Expected Behavior
```
✅ Form validates (no empty fields error)
✅ Success notification appears: "Ticket created successfully!"
✅ Auto-redirects to /ticketdetails/1
✅ You see Ticket Details page
```

### Step 3: Go Back to Create Another Ticket
```
[Click Home Logo/Button]
OR
[Click "Create Tickets" Link in Navigation]
```

### You're back at Create form (blank)

### Step 4: Fill Out TICKET 2
```
Title: "Monitor Display Broken"
Description: "Screen shows no signal"
Priority: HIGH (Orange)
Category: Hardware
Location: Office Desk B2
Reporter Email: user1@company.com

[Click "Create Ticket Button"]
```

### Expected Behavior
```
✅ Success notification
✅ Auto-redirects to /ticketdetails/2
✅ Notice: URL shows /ticketdetails/2 (not /1)
```

### Step 5: Create TICKET 3
```
[Go Home again]

Title: "Email Login Failing"
Description: "Cannot access email account"
Priority: MEDIUM (Yellow)
Category: Software
Location: Remote
Reporter Email: user2@company.com

[Click "Create Ticket Button"]
```

### Expected Behavior
```
✅ Success notification
✅ Auto-redirects to /ticketdetails/3
✅ URL shows /ticketdetails/3
```

---

## **PART 2: VIEWING ALL TICKETS**

### Step 6: View All Tickets List
```
[Click "View All Tickets" Link in Navigation]
OR
[Click "Ticket Dashboard" Card on Home]
```

### You See Ticket List Like This
```
┌────────────────────────────────────────────────┐
│           ALL TICKETS DASHBOARD               │
├────────────────────────────────────────────────┤
│                                                │
│  Search: [____________]                       │
│                                                │
│  Filters:                                      │
│  Status: [▼ All]  Priority: [▼ All]           │
│  Category: [▼ All]                            │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ Ticket #1                           ● ●  │ │
│ │ Server Down - Database Offline      │ │  │ │
│ │ ├─ Category: Infrastructure         │ │  │ │
│ │ ├─ Priority: 🔴 CRITICAL            │ │  │ │
│ │ ├─ Status: 🔴 OPEN                  │ │  │ │
│ │ └─ Reporter: admin@company.com      │ │  │ │
│ │ [View Details]                      │ │  │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ Ticket #2                           ● ●  │ │
│ │ Monitor Display Broken              │ │  │ │
│ │ ├─ Category: Hardware ✅ DIFFERENT!  │ │  │ │
│ │ ├─ Priority: 🟠 HIGH                │ │  │ │
│ │ ├─ Status: 🔴 OPEN                  │ │  │ │
│ │ └─ Reporter: user1@company.com      │ │  │ │
│ │ [View Details]                      │ │  │ │
│ └──────────────────────────────────────────┘ │
│                                                │
│ ┌──────────────────────────────────────────┐ │
│ │ Ticket #3                           ● ●  │ │
│ │ Email Login Failing                 │ │  │ │
│ │ ├─ Category: Software ✅ DIFFERENT!   │ │  │ │
│ │ ├─ Priority: 🟡 MEDIUM              │ │  │ │
│ │ ├─ Status: 🟢 RESOLVED ✅ DIFFERENT! │ │  │ │
│ │ └─ Reporter: user2@company.com      │ │  │ │
│ │ [View Details]                      │ │  │ │
│ └──────────────────────────────────────────┘ │
│                                                │
└────────────────────────────────────────────────┘

KEY OBSERVATION: ✅✅✅
- Categories are DIFFERENT (Infrastructure, Hardware, Software)
- Priorities are DIFFERENT (CRITICAL, HIGH, MEDIUM) ← Different colors!
- Statuses are DIFFERENT (2 OPEN, 1 RESOLVED) ← Different colors!
- Reporters are DIFFERENT emails!
```

**This proves your system is working!**

---

## **PART 3: ADDING COMMENTS TO ISOLATED TICKETS**

### Step 7: Open Ticket 1 Details
```
[Click "View Details" on Ticket #1]
OR
[Search: "Server Down" then click result]
```

### You See Ticket 1 Details Page
```
URL shows: http://localhost:3000/ticketdetails/1  ← ID in URL!

┌─────────────────────────────────────────────┐
│        TICKET #1 - SERVER DOWN              │
├─────────────────────────────────────────────┤
│                                             │
│ [Details] [Comments] [Attachments] (tabs)  │
│                                             │
│ Status: [OPEN ▼]  Technician: [       ]   │
│                                             │
│ ┌───────────────────────────────────────┐ │
│ │ DETAILS TAB (shown)                   │ │
│ │                                       │ │
│ │ Title: Server Down - Offline         │ │
│ │ Category: Infrastructure              │ │
│ │ Priority: CRITICAL                    │ │
│ │ Location: Data Center A               │ │
│ │ Reporter: admin@company.com           │ │
│ └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Step 8: Click "Comments" Tab
```
[Click on "Comments" Tab]
```

### You See Empty Comments Section
```
┌─────────────────────────────────────────────┐
│        TICKET #1                            │
├─────────────────────────────────────────────┤
│                                             │
│ [Details] [Comments] ← (highlighted)       │
│                    [Attachments] (tabs)    │
│                                             │
│ ┌───────────────────────────────────────┐ │
│ │ COMMENTS SECTION                      │ │
│ │                                       │ │
│ │ [No comments yet]  ✅ (Empty)        │ │
│ │                                       │ │
│ │ Add Comment:                          │ │
│ │ [Comment text field...     ]          │ │
│ │ [Post Comment Button]                 │ │
│ │                                       │ │
│ └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Step 9: Add Comment to Ticket 1
```
Type in comment field:
"Server is completely unresponsive. Need immediate restart."

[Click "Post Comment" Button]
```

### Expected Behavior
```
✅ Comment appears in list:
   "Server is completely unresponsive. Need immediate restart."
   Posted by: admin@company.com
   Time: Just now

✅ Comment counter might show "1 Comment"
```

### Step 10: Go to TICKET 2 and Check Comments
```
[Click "All Tickets" in navigation]
OR
[Search for "Monitor"]

[Click "View Details" on Ticket #2]
```

### Now You're on Ticket 2 (/ticketdetails/2)
```
URL shows: http://localhost:3000/ticketdetails/2  ← DIFFERENT ID!

[Click "Comments" Tab]
```

### You See EMPTY Comments (NOT the comment from Ticket 1!)
```
┌─────────────────────────────────────────────┐
│        TICKET #2 - MONITOR BROKEN           │
├─────────────────────────────────────────────┤
│ [Details] [Comments] ← (highlighted)        │
│                    [Attachments] (tabs)    │
│                                             │
│ ┌───────────────────────────────────────┐ │
│ │ COMMENTS SECTION                      │ │
│ │                                       │ │
│ │ [No comments yet]  ✅ (EMPTY!)       │ │
│ │                                       │ │
│ │ ❌ You do NOT see:                   │ │
│ │    "Server is completely unres..." │ │
│ │    ↑(That comment from Ticket 1!)    │ │
│ │                                       │ │
│ │ Add Comment:                          │ │
│ │ [Comment text field...     ]          │ │
│ │ [Post Comment Button]                 │ │
│ │                                       │ │
│ └───────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘

🎉 KEY: EMPTY comments for Ticket 2!
    This PROVES comments are ISOLATED by ticket!
```

### Step 11: Add Different Comment to Ticket 2
```
Type in comment field:
"Screen has no signal - checked all cables"

[Click "Post Comment" Button]
```

### Expected Behavior
```
✅ This comment appears ONLY for Ticket 2
```

### Step 12: Verify by Switching Back to Ticket 1
```
[Go back to Ticket #1]
OR
[Search "Server Down" → View Details]
```

### You See Ticket 1 Comments Again
```
[Click "Comments" Tab]

Comments shown:
✅ "Server is completely unresponsive..."
❌ NOT "Screen has no signal..."

Conclusion: Each ticket has its OWN comments!
```

---

## **PART 4: STATUS TRACKING ISOLATION**

### Step 13: Change Status of Ticket 1
```
You're on /ticketdetails/1
[Click "Details" Tab]

Find:
Status: [OPEN ▼]

[Click the dropdown]
```

### Status Dropdown Shows
```
[OPEN] ← (currently selected)
[IN_PROGRESS]
[RESOLVED]
[CLOSED]
[ON_HOLD]
```

### Step 14: Select "IN_PROGRESS"
```
[Click "IN_PROGRESS"]
```

### You See
```
Status changed to: IN_PROGRESS (badge color changes to ORANGE)

✅ Ticket 1 now shows IN_PROGRESS status
```

### Step 15: Go to Ticket 2 and Check Status
```
[Go to Ticket #2 Details]

[Click "Details" Tab]

Status field shows: OPEN (still red badge!)

✅ Ticket 2 is STILL OPEN
❌ Did NOT change to IN_PROGRESS
```

### This Proves
```
Changing Ticket 1 status does NOT affect Ticket 2!
Each ticket's status is INDEPENDENT!
```

---

## **PART 5: TECHNICIAN ASSIGNMENT ISOLATION**

### Step 16: Assign Technician to Ticket 1
```
You're on /ticketdetails/1

Find:
Technician: [_____________]

Type: alice@company.com

[Save Button or Auto-save]
```

### You See
```
Technician field now shows: alice@company.com

Status might change to: "Assigned to: alice@company.com"
```

### Step 17: Go to Ticket 2
```
[Navigate to /ticketdetails/2]

Find:
Technician: [_____________]

Field is EMPTY! ❌ Does NOT show alice@company.com
```

### Step 18: Assign DIFFERENT Technician to Ticket 2
```
Type: bob@company.com

[Save]
```

### Now You Have
```
Ticket 1: Assigned to alice@company.com ✅
Ticket 2: Assigned to bob@company.com ✅ (DIFFERENT person!)

Conclusion: Each ticket has independent technician assignment!
```

---

## **PART 6: FILTERS SHOW DATA DIFFERENCES**

### Step 19: Go to All Tickets List
```
[Click "View All Tickets"]
```

### Step 20: Filter by Category
```
Category dropdown: [Infrastructure]

Results show:
✅ Only Ticket #1 (Infrastructure)
❌ Ticket #2 not shown (Hardware category)
❌ Ticket #3 not shown (Software category)
```

### Step 21: Change Filter to Hardware
```
Category dropdown: [Hardware]

Results show:
❌ Ticket #1 not shown (different category)
✅ Only Ticket #2 (Hardware)
❌ Ticket #3 not shown (Software)
```

### This Proves
```
Categories are COMPLETELY DIFFERENT for each ticket!
Filter works because data is actually different in database!
```

---

## **PART 7: Browser DevTools Verification**

### Step 22: Open Browser DevTools (F12)
```
Press: F12
New panel opens at bottom showing Developer Tools
```

### Step 23: Go to Network Tab
```
[Click "Network" tab in DevTools]
(Filter might show "XHR" for API calls)
```

### Step 24: Navigate to Ticket 1
```
Go to /ticketdetails/1

In Network tab, you'll see:
GET /api/tickets/1

Click it ↓ Shows:
Request: GET http://localhost:8080/api/tickets/1
Response: {
  "id": 1,
  "title": "Server Down",
  "category": "Infrastructure",
  "priority": "CRITICAL",
  "comments": [...],
  "attachments": [...]
}
```

### Step 25: Navigate to Ticket 2
```
Go to /ticketdetails/2

In Network tab, new request:
GET /api/tickets/2

Click it ↓ Shows:
Request: GET http://localhost:8080/api/tickets/2
Response: {
  "id": 2,
  "title": "Monitor Display Broken",
  "category": "Hardware",
  "priority": "HIGH",
  "comments": [...],      ← DIFFERENT comments!
  "attachments": [...]    ← DIFFERENT attachments!
}
```

### Key Observation
```
Request URL CHANGES: /tickets/1 vs /tickets/2
Response DATA CHANGES: Different categories, different comments

This PROVES:
✅ Frontend uses different URL for each ticket
✅ Backend returns different data based on ticket ID
✅ Everything is COMPLETELY ISOLATED!
```

---

## **✅ FINAL CONCLUSION**

After following this guide, you'll see:

```
Ticket 1:
  ├─ Category: Infrastructure
  ├─ Comments: "Server is completely unresponsive..."
  ├─ Status: IN_PROGRESS
  ├─ Technician: alice@company.com
  └─ Attachments: [uploaded files]

Ticket 2:
  ├─ Category: Hardware ← DIFFERENT!
  ├─ Comments: "Screen has no signal..." ← DIFFERENT!
  ├─ Status: OPEN ← DIFFERENT!
  ├─ Technician: bob@company.com ← DIFFERENT!
  └─ Attachments: [different files] ← DIFFERENT!

Ticket 3:
  ├─ Category: Software ← DIFFERENT!
  ├─ Comments: (empty) ← DIFFERENT!
  ├─ Status: RESOLVED ← DIFFERENT!
  ├─ Technician: (unassigned) ← DIFFERENT!
  └─ Attachments: (empty) ← DIFFERENT!
```

**Every single field is different!** ✅✅✅

Your system is working **PERFECTLY**! 🎉

---

## 🚀 **YOU NOW HAVE PROOF**

1. **Created multiple tickets** with different data
2. **Added different comments** to each ticket
3. **Assigned different technicians** to each ticket
4. **Changed status** independently for each ticket
5. **Verified in browser** that API requests are different for each ID
6. **Confirmed**: Each ticket shows ONLY its own data!

**Your Maintenance & Incident Ticketing System is 100% working!** 🎊

