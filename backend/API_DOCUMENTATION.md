# Student Attendance Management System - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### Register (Student Self-Registration)
- **POST** `/register`
- **Description:** Students can self-register. Instructors and admins are created by admins.
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "password_confirmation": "string"
  }
  ```
- **Note:** Role is automatically set to "student". Instructors must be created by admins via `/admin/users`.

### Login
- **POST** `/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Logout
- **POST** `/logout`
- **Auth:** Required

### Get Current User
- **GET** `/user`
- **Auth:** Required

---

## Admin Endpoints

### User Management
- **GET** `/admin/users` - List all users (paginated)
- **POST** `/admin/users` - Create new user
- **PUT** `/admin/users/{id}` - Update user
- **DELETE** `/admin/users/{id}` - Delete user
- **Auth:** Admin only

---

## Course Endpoints

### List Courses
- **GET** `/courses`
- **Auth:** Required

### Get Course
- **GET** `/courses/{id}`
- **Auth:** Required

### Create Course
- **POST** `/courses`
- **Auth:** Admin only
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string (optional)",
    "instructor_id": "integer"
  }
  ```

### Update Course
- **PUT** `/courses/{id}`
- **Auth:** Admin only

### Delete Course
- **DELETE** `/courses/{id}`
- **Auth:** Admin only

---

## Enrollment Endpoints

### Enroll Student
- **POST** `/enrollments`
- **Auth:** Admin only
- **Body:**
  ```json
  {
    "student_id": "integer",
    "course_id": "integer"
  }
  ```

### Unenroll Student
- **DELETE** `/enrollments/{id}`
- **Auth:** Admin only

### Get Student Courses
- **GET** `/students/{studentId}/courses`
- **Auth:** Required

### Get Course Students
- **GET** `/courses/{courseId}/students`
- **Auth:** Required

---

## Schedule Endpoints

### Create Schedule
- **POST** `/schedules`
- **Auth:** Admin only
- **Body:**
  ```json
  {
    "course_id": "integer",
    "day": "string",
    "time": "HH:mm"
  }
  ```

### Update Schedule
- **PUT** `/schedules/{id}`
- **Auth:** Admin only

### Delete Schedule
- **DELETE** `/schedules/{id}`
- **Auth:** Admin only

### Get Course Schedules
- **GET** `/courses/{courseId}/schedules`
- **Auth:** Required

---

## Attendance Endpoints

### Mark Attendance
- **POST** `/attendance`
- **Auth:** Instructor or Admin
- **Body:**
  ```json
  {
    "course_id": "integer",
    "student_id": "integer",
    "date": "YYYY-MM-DD",
    "status": "present|absent|late"
  }
  ```

### Update Attendance
- **PUT** `/attendance/{id}`
- **Auth:** Instructor or Admin
- **Body:**
  ```json
  {
    "status": "present|absent|late"
  }
  ```

### Get Course Attendance
- **GET** `/courses/{courseId}/attendance`
- **Auth:** Required

### Get Student Attendance
- **GET** `/students/{studentId}/attendance`
- **Auth:** Required (students can only view their own)

### Get Attendance Percentage
- **GET** `/students/{studentId}/courses/{courseId}/percentage`
- **Auth:** Required

### Get Low Attendance Students
- **GET** `/courses/{courseId}/attendance/low?threshold=75`
- **Auth:** Instructor or Admin

### Get Attendance by Date Range
- **GET** `/courses/{courseId}/attendance/range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **Auth:** Instructor or Admin

---

## Report Endpoints

### Daily Report
- **GET** `/reports/daily?date=YYYY-MM-DD`
- **Auth:** Admin or Instructor

### Weekly Report
- **GET** `/reports/weekly?start_date=YYYY-MM-DD`
- **Auth:** Admin or Instructor

### Monthly Report
- **GET** `/reports/monthly?month=1-12&year=YYYY`
- **Auth:** Admin or Instructor

### Course Report
- **GET** `/reports/course/{courseId}?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **Auth:** Admin or Instructor (instructors can only view their own courses)

---

## Notification Endpoints

### Get User Notifications
- **GET** `/notifications`
- **Auth:** Required

### Mark Notification as Read
- **PUT** `/notifications/{id}/read`
- **Auth:** Required

### Create Notification
- **POST** `/notifications`
- **Auth:** Required
- **Body:**
  ```json
  {
    "user_id": "integer",
    "message": "string",
    "type": "string"
  }
  ```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {},
  "code": "ERROR_CODE"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error
