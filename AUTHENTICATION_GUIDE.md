# Gurukul Institute - Authentication & Admin Guide

## System Overview

The application uses a **role-based authentication system** with three user types:
- **Admin** (Master Account) - Creates and manages teacher accounts
- **Teachers** - Upload lectures for assigned subjects only
- **Students** - Access lectures and learning materials

## Master Admin Account

Only ONE admin account exists to maintain security and control:

- **Email:** `admin@gurukul.com`
- **Password:** `admin@123`
- **Access:** Full system control, teacher management

### Admin Capabilities

The admin can:
1. **Create Teacher Accounts** with email, password, and subject assignments
2. **Assign Subjects** to teachers (Physics, Chemistry, Math, Biology, etc.)
3. **View All Teachers** with their credentials and assigned subjects
4. **View All Students** registered in the system
5. **Monitor All Lectures** uploaded by teachers
6. **Delete Teachers** when needed

## Teacher Accounts

Teachers **CANNOT self-register**. They must be created by the admin.

### How Admin Creates Teachers:

1. Login as admin
2. Navigate to "Create Teacher ID"
3. Fill in teacher details:
   - Full Name
   - Email Address
   - Password (visible to admin for sharing)
   - Mobile Number
   - **Assign Subjects** (select one or more)
4. Teacher can now login and upload lectures **only for assigned subjects**

### Teacher Capabilities

Once created by admin, teachers can:
- **Upload Lectures** to specific batches (IIT JEE, NEET, etc.)
- **Select Only Assigned Subjects** when uploading
- **Manage Their Lectures** (view and delete)
- **View Batch Statistics**
- **View Students** enrolled in the system

### Example Teacher Workflow:

1. Admin creates teacher account with subjects: "Physics, Mathematics"
2. Teacher logs in with provided credentials
3. Teacher can only upload Physics or Mathematics lectures
4. Other subjects (Chemistry, Biology, etc.) won't appear in dropdown

## Student Accounts

Students CAN self-register through the public registration page.

### Student Registration:

Students provide:
- Full Name
- Email Address (must be unique)
- Mobile Number (10 digits)
- Password (minimum 6 characters)
- Batch Selection (optional): IIT JEE 2024/2025, NEET, etc.

### Student Capabilities:

- Access Student Dashboard
- View available lectures by batch
- Track learning progress
- Access course materials

## Available Batches

- IIT JEE 2024
- IIT JEE 2025
- NEET 2024
- NEET 2025
- Class 10 - 2024
- Class 12 - 2024
- SSC CGL 2024

## Available Subjects

Teachers can be assigned any combination of:
- Physics
- Chemistry
- Mathematics
- Biology
- English
- General Studies
- Reasoning
- Current Affairs
- Computer Science
- History
- Geography
- Economics

## Quick Start Guide

### For Admin:
1. Login with admin credentials
2. Create first teacher account with subject assignments
3. Share login credentials with teacher
4. Monitor lectures and manage system

### For Teachers:
1. Receive credentials from admin
2. Login to teacher panel
3. Upload lectures for assigned subjects only
4. Manage content and view students

### For Students:
1. Visit registration page
2. Create student account
3. Select batch (optional)
4. Login to access dashboard

## Data Storage

All data is stored locally in browser's localStorage:
- `gurukul_user` - Current logged-in user session
- `gurukul_teachers` - All teacher accounts created by admin
- `gurukul_registered_users` - All student accounts
- `gurukul_lectures` - All uploaded lectures database

## Security Notes

⚠️ **Important:** This is a **frontend-only prototype** for demonstration purposes.

**NOT suitable for production use** because:
- Passwords stored in plain text in localStorage
- No server-side validation
- No file encryption
- No backup/recovery system
- No audit logs

### For Production Deployment, You Need:

1. **Backend API** with secure authentication (JWT tokens)
2. **Database** (PostgreSQL, MySQL) for persistent storage
3. **File Storage Service** (AWS S3, Cloudflare R2) for lecture videos
4. **Password Encryption** (bcrypt, argon2)
5. **Role-Based Access Control** (RBAC) middleware
6. **SSL/TLS Encryption** for all communications
7. **Session Management** with expiry
8. **Audit Logging** for admin actions
9. **Email Verification** for registrations
10. **Data Protection Compliance** (GDPR, etc.)

## Workflow Example

### Scenario: Setting up Physics teacher for IIT JEE batch

1. **Admin Login:**
   - Email: admin@gurukul.com
   - Password: admin@123

2. **Admin Creates Teacher:**
   - Name: Dr. Rajesh Kumar
   - Email: rajesh.kumar@gurukul.com
   - Password: physics@123
   - Mobile: 9876543210
   - Assigned Subjects: ✅ Physics, ✅ Mathematics

3. **Share Credentials with Teacher:**
   - Admin shares email and password with Dr. Kumar

4. **Teacher Login:**
   - Dr. Kumar logs in
   - Sees only "Physics" and "Mathematics" in subject dropdown
   - Cannot upload Chemistry, Biology, etc.

5. **Teacher Uploads Lecture:**
   - Title: "Newton's Laws of Motion"
   - Batch: IIT JEE 2024
   - Subject: Physics (only assigned subjects shown)
   - Upload video file
   - Submit

6. **Students Access:**
   - IIT JEE 2024 students can view this lecture
   - Organized by batch and subject

## Navigation Flow

```
Login Page
    ├─→ Admin Login → Admin Master Panel
    │                  ├─ Create Teachers
    │                  ├─ View All Teachers
    │                  ├─ View All Students
    │                  └─ View All Lectures
    │
    ├─→ Teacher Login → Teacher Panel
    │                   ├─ Upload Lectures (assigned subjects only)
    │                   ├─ My Lectures
    │                   ├─ Batch Statistics
    │                   └─ View Students
    │
    └─→ Student Login → Student Dashboard
                        ├─ My Lectures
                        ├─ Courses
                        └─ Progress Tracking
```

## Troubleshooting

**Teacher can't see their subject in dropdown?**
- Admin needs to assign subjects to teacher account
- Check teacher's assigned subjects in admin panel

**Login not working?**
- Verify email and password
- Check if teacher account was created by admin
- Clear browser cache/localStorage if needed

**Can't create duplicate email?**
- Each email must be unique across all users
- Check if email already exists in system

**Reset System Data:**
- Open browser DevTools (F12)
- Go to Application/Storage → Local Storage
- Delete all `gurukul_*` keys
- Refresh page

## Browser Compatibility

Works in all modern browsers supporting:
- localStorage
- ES6+ JavaScript
- CSS Grid/Flexbox
