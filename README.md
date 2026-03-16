# SIMS - Student Information Management System

A comprehensive web application for managing academic operations at universities. Built with modern technologies for scalability, security, and user-friendliness.

**University**: Madda Walabu University - Computing College  
**Version**: 1.0.0  
**Status**: Production Ready

---

## 📋 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [Key Workflows](#key-workflows)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

SIMS automates and streamlines all academic operations at universities. It provides role-based access control, assessment-based grading, real-time grade tracking, and comprehensive reporting.

### Key Highlights
- ✅ Multi-role user system (Admin, Department Head, Instructor, Student)
- ✅ Assessment-based grading with automatic calculations
- ✅ Complete enrollment workflow with approvals
- ✅ Real-time grade tracking and visibility
- ✅ Attendance management and tracking
- ✅ Comprehensive reporting and analytics
- ✅ Secure authentication and authorization
- ✅ Scalable architecture

---

## 🔍 Problem Statement

Universities face challenges in managing academic operations manually:
- Manual record keeping in spreadsheets
- Data inconsistency and errors
- Inefficient workflows
- Lack of transparency for students
- Time-consuming manual processes
- No audit trail
- Limited reporting capabilities
- Security risks with paper records

---

## ✨ Solution

SIMS provides:
- Centralized database for all academic data
- Automated workflows for enrollment and grading
- Role-based access control
- Assessment-based grading system
- Real-time visibility for all stakeholders
- Comprehensive reporting and analytics
- Secure authentication and authorization

---

## 🚀 Features

### For Students
- 📚 Course registration and enrollment
- 📊 View final grades with assessment breakdown
- 📋 Track attendance records
- 👤 Manage profile information

### For Instructors
- 📝 Enter grades using assessment-based system
- 📊 View student performance
- 📋 Record and manage attendance
- ✅ Submit grades for approval

### For Department Heads
- 👥 Manage department courses and instructors
- ✅ Approve student enrollments
- 📊 Review and approve grades
- 📈 View department performance metrics

### For Admins
- 🔐 Complete system control
- 👤 User management (create, edit, delete)
- 🏢 Department management
- 📚 Course management
- 📊 Grade finalization
- 📈 System-wide reports

---

## � Tech Stack

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Language**: JavaScript/TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **API**: RESTful with Sanctum authentication
- **Database**: MySQL/SQLite
- **ORM**: Eloquent

---

## � Project Structure

```
SIMS/
├── sims-frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Pages and routes
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
│
├── sims-backend/           # Laravel backend application
│   ├── app/
│   │   ├── Http/           # Controllers, middleware, requests
│   │   ├── Models/         # Database models
│   │   ├── Policies/       # Authorization policies
│   │   └── Services/       # Business logic
│   ├── database/
│   │   ├── migrations/     # Database schema
│   │   └── seeders/        # Sample data
│   ├── routes/
│   │   └── api.php         # API routes
│   └── composer.json
│
└── README.md               # This file
```

---

## 🔧 Installation

### Prerequisites
- PHP 8.2+
- Node.js 18+
- MySQL 8.0+ or SQLite
- Composer
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd sims-backend
```

2. **Install dependencies**
```bash
composer install
```

3. **Copy environment file**
```bash
cp .env.example .env
```

4. **Generate application key**
```bash
php artisan key:generate
```

5. **Configure database in .env**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sims
DB_USERNAME=root
DB_PASSWORD=
```

6. **Run migrations**
```bash
php artisan migrate
```

7. **Seed database with sample data**
```bash
php artisan db:seed
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd sims-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env.local file**
```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

---

## ▶️ Running the Application

### Start Backend Server
```bash
cd sims-backend
php artisan serve
```
Backend runs on: `http://127.0.0.1:8000`

### Start Frontend Server
```bash
cd sims-frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Access the Application
- **URL**: http://localhost:3000
- **Admin Login**: melese74 / 0dfd27mb
- **Instructor Login**: INS001 / temp1234
- **Student Login**: UGR/50001/26 / student1234

---

## 👥 User Roles

### Admin
- Full system access
- User management
- Department management
- Course management
- Grade finalization
- System reports

### Department Head
- Manage department courses
- Assign instructors
- Approve enrollments
- Approve grades
- View department metrics

### Instructor
- View assigned courses
- Enter grades with assessments
- Record attendance
- View student performance

### Student
- Register for courses
- View grades with breakdown
- View attendance
- Manage profile

---

## 🔄 Key Workflows

### Enrollment Workflow
```
Student registers for course
    ↓
Department head reviews
    ↓
Department head approves/rejects
    ↓
Student sees enrollment status
```

### Grade Management Workflow
```
Instructor enters assessments
    ↓
System calculates total and letter grade
    ↓
Department head reviews and approves
    ↓
Admin finalizes grades
    ↓
Student views final grade
```

### User Management Workflow
```
Admin creates user account
    ↓
Admin links to student/instructor record
    ↓
Admin assigns role
    ↓
User logs in and changes password
    ↓
User accesses appropriate dashboard
```

---

## 📡 API Endpoints

### Authentication
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /change-password` - Change password

### Users
- `GET /users` - Get all users
- `POST /users` - Create user
- `GET /users/{id}` - Get user details
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `POST /users/{id}/promote-to-head` - Promote to department head
- `POST /users/{id}/demote-to-instructor` - Demote to instructor

### Courses
- `GET /courses` - Get all courses
- `POST /courses` - Create course
- `GET /courses/{id}` - Get course details
- `PUT /courses/{id}` - Update course
- `POST /courses/{id}/assign-instructor` - Assign instructor
- `POST /courses/{id}/enroll-student` - Enroll student

### Grades
- `POST /instructor/grades` - Enter grade
- `GET /instructor/courses/{courseId}/grades` - Get course grades
- `GET /department/pending-grades` - Get pending grades
- `PUT /department/grades/{id}/approve` - Approve grade
- `GET /student/grades` - Get student grades

### Attendance
- `POST /instructor/attendance` - Record attendance
- `GET /instructor/courses/{courseId}/attendance` - Get course attendance
- `GET /student/attendance` - Get student attendance

---

## 🧪 Testing

### Using Postman

1. **Import Postman Collection**
   - File: `sims-backend/SIMS_API_Postman_Collection.json`
   - Import into Postman

2. **Set Environment Variables**
   - Create environment: `SIMS Local`
   - Set `base_url`: `http://127.0.0.1:8000/api`
   - Set `token`: (obtained from login)

3. **Test Endpoints**
   - Login to get token
   - Use token for authenticated requests
   - Test each endpoint

### Running Tests
```bash
cd sims-backend
php artisan test
```

---

## 🐛 Troubleshooting

### MySQL Connection Error
**Error**: `SQLSTATE[HY000] [2002] No connection could be made`

**Solution**: Start MySQL service
- XAMPP: Click Start next to MySQL
- Command: `net start MySQL80`

### Frontend Can't Connect to Backend
**Error**: `Failed to load resource: 500 Internal Server Error`

**Solution**: 
- Ensure backend is running: `php artisan serve`
- Check `.env` file has correct database credentials
- Run migrations: `php artisan migrate`

### Port Already in Use
**Error**: `Port 8000 is already in use`

**Solution**: Use different port
```bash
php artisan serve --port=8001
```

### Database Migration Error
**Error**: `SQLSTATE[HY000]: General error`

**Solution**: 
- Reset database: `php artisan migrate:refresh`
- Seed data: `php artisan db:seed`

---

## 📊 Database Schema

### Main Tables
- **users** - User accounts with roles
- **students** - Student records
- **instructors** - Instructor records
- **departments** - Department information
- **courses** - Course details
- **grades** - Student grades with assessments
- **attendance** - Attendance records
- **course_instructor** - Course-instructor relationships
- **course_student** - Course-student relationships

---

## 🔐 Security Features

- ✅ Token-based authentication (Laravel Sanctum)
- ✅ Role-based access control (RBAC)
- ✅ Password hashing (bcrypt)
- ✅ CORS protection
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Audit trails for grade changes

---

## 📈 Performance Optimization

- Database indexing on frequently queried columns
- Query optimization with eager loading
- Caching for frequently accessed data
- Pagination for large datasets
- Lazy loading of relationships

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💼 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@mwu.edu.et
- Documentation: See BACKEND_STRUCTURE.md and PRESENTATION_GUIDE.md

---

## 🎓 Credits

**Developed for**: Madda Walabu University - Computing College  
**Version**: 1.0.0  
**Last Updated**: March 2026

---

## 📞 Contact

- **Email**: admin@sims.mwu.edu.et
- **Phone**: +251-XXX-XXX-XXXX
- **Website**: https://www.mwu.edu.et

---

**Happy Learning! 🚀**
