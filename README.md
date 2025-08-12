# Leave Management System

## Project Overview

Ye ek simple Leave Management System hai jo chhoti startups ke liye banaaya gaya hai (approx 50 employees). Is system se employees apni leaves apply kar sakte hain, aur Admin/HR team unhe approve ya reject kar sakti hai. System employee leave balance track karta hai, aur authorization role-based hai.

---

## Tech Stack

- **Frontend:** React (with React Router, Axios, Tailwind CSS)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (NoSQL) using Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Styling:** Tailwind CSS for utility-first styling
- **Development tools:** Nodemon, dotenv, bcryptjs for password hashing, cors for cross-origin support

---

## Features / API Endpoints

| Feature              | Method | Endpoint                      | Auth Role | Description                       |
| -------------------- | ------ | ----------------------------- | --------- | --------------------------------- |
| Register User        | POST   | `/api/auth/register`          | Public    | Register employee/admin/hr        |
| Login                | POST   | `/api/auth/login`             | Public    | Login and get JWT token           |
| Apply Leave          | POST   | `/api/leaves`                 | Employee  | Apply for leave                   |
| Get My Leaves        | GET    | `/api/leaves/my`              | Employee  | List leaves of logged in employee |
| Cancel My Leave      | PUT    | `/api/leaves/cancel/:id`      | Employee  | Cancel own leave                  |
| Get All Leaves       | GET    | `/api/leaves`                 | Admin, HR | View all leaves                   |
| Approve Leave        | PUT    | `/api/leaves/approve/:id`     | Admin, HR | Approve a leave                   |
| Reject Leave         | PUT    | `/api/leaves/reject/:id`      | Admin, HR | Reject a leave                    |
| Admin Dashboard Test | GET    | `/api/leaves/admin-dashboard` | Admin     | Admin-only test endpoint          |

---

## Setup Instructions

1. **Backend Setup:**

```bash
cd Backend
npm install
Create .env file in Backend folder:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Run backend server:


npm run dev
Frontend Setup:


cd Frontend
npm install
npm run dev
Frontend runs on http://localhost:5173 (or another port if 5173 is busy)

Architecture Diagram

+------------+          +------------------+           +--------------+
|  Frontend  |  HTTP    |   Backend API    |  Queries  |   MongoDB    |
|  (React)   +--------->| (Node.js +       +---------->|  (NoSQL DB)  |
|            |          |  Express REST API)|          |              |
+------------+          +------------------+           +--------------+
       ↑                        ↑
       |                        |
       |      Auth & Role       |
       +------------------------+
Important Assumptions
Roles are fixed: Admin, HR, Employee.

Leave balance is managed per employee and checked on apply.

User joining date must be before applying leave.

Passwords are hashed with bcrypt before saving.

JWT tokens are used for authentication and role-based authorization.

Overlapping leaves by the same employee are not allowed.

Cancel is only possible for leaves in Pending status.

Leave cannot be approved/rejected multiple times.

Edge Cases Handled
Apply leave with start date before joining date → error.

Applying leave with end date before start date → error.

Applying leave for more days than balance → error.

Overlapping leave requests for same employee → error.

Attempting to cancel approved or rejected leave → error.

Invalid leave id in approve/reject/cancel → error.

User registration with invalid role → error.

Unauthorized access to admin routes → error.

Potential Improvements / Future Work
Add pagination and filtering to leaves list.

Integrate email notifications on leave status change.

Add frontend validations and better UX feedback.

Implement a detailed leave balance calculation with carry-forward leaves.

Add unit and integration tests.

Add support for half-day leaves and different leave types.

Deploy on cloud hosting with CI/CD pipelines.

Contact
For questions, contact [Your Name] at [your.email@example.com]

This project was developed as a mini leave management system assignment to demonstrate full-stack development and system design skills.

## Screenshots & Explanation

### 1. Register Page (Screenshot 2.png)
![Register Page](./IMG/Screenshot%202.png)
This page allows users to register. Both employees and admins can sign up by providing their details here.

---

### 2. Login Page (Screenshot 1.png)
![Login Page](./IMG/Screenshot%201.png)
Users can log in using their credentials on this page.

---

### 3. Employee Dashboard (Screenshot 3.png)
![Employee Dashboard](./IMG/Screenshot%203.png)
This dashboard shows employees their leave applications and their current statuses, as shown in the image.

---

### 4. Admin Dashboard (Screenshot 4.png)
![Admin Dashboard](./IMG/Screenshot%204.png)
This dashboard is for admins, where they can view, approve, or reject leave requests.

---

### 5. Employee Dashboard After Approval (Screenshot 5.png)
![Employee Dashboard After Approval](./IMG/Screenshot%205.png)
Once a leave request is approved by the admin, the updated status is reflected on the employee’s dashboard.

```
