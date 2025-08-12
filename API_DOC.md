# API Documentation - Leave Management System

**Base URL:** `http://localhost:5000/api/leaves`

---

## 1. Admin Dashboard Test

**Method:** `GET`  
**URL:** `/admin-dashboard`  
**Auth Required:** Yes (Role: `Admin`)

### Success Response

```json
"Welcome Admin!"
Error Example

{ "error": "Access denied. Admins only." }
2. Apply for Leave (Employee)
Method: POST
URL: /
Auth Required: Yes (Role: Employee)

Request Example

{
  "startDate": "2025-08-15",
  "endDate": "2025-08-18",
  "reason": "Medical leave"
}
Success Response

{
  "success": true,
  "message": "Leave applied successfully",
  "leaveId": 12
}
Error Examples

{ "error": "Invalid leave dates" }
{ "error": "Insufficient leave balance" }
3. Get My Leaves (Employee)
Method: GET
URL: /my
Auth Required: Yes (Role: Employee)

Success Response

[
  {
    "id": 12,
    "startDate": "2025-08-15",
    "endDate": "2025-08-18",
    "status": "Pending",
    "reason": "Medical leave"
  }
]
4. Cancel My Leave (Employee)
Method: PUT
URL: /cancel/:id
Auth Required: Yes (Role: Employee)

Success Response

{
  "success": true,
  "message": "Leave cancelled successfully"
}
Error Examples

{ "error": "Leave not found" }
{ "error": "Cannot cancel approved/rejected leave" }
5. Get All Leaves (Admin/HR)
Method: GET
URL: /
Auth Required: Yes (Roles: Admin, HR)

Success Response

[
  {
    "id": 12,
    "employeeName": "John Doe",
    "startDate": "2025-08-15",
    "endDate": "2025-08-18",
    "status": "Pending"
  }
]
6. Approve Leave (Admin/HR)
Method: PUT
URL: /approve/:id
Auth Required: Yes (Roles: Admin, HR)

Success Response

{
  "success": true,
  "message": "Leave approved successfully"
}
Error Examples

{ "error": "Leave not found" }
{ "error": "Leave already processed" }
7. Reject Leave (Admin/HR)
Method: PUT
URL: /reject/:id
Auth Required: Yes (Roles: Admin, HR)

Request Example

{
  "reason": "Workload during requested dates"
}
Success Response

{
  "success": true,
  "message": "Leave rejected successfully"
}
Error Examples

{ "error": "Leave not found" }
{ "error": "Leave already processed" }
```
