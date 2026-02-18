# Student Attendance Management System - Backend

Laravel-based REST API for managing student attendance in educational institutions.

## Features

- ✅ User authentication with Laravel Sanctum
- ✅ Role-based access control (Admin, Instructor, Student)
- ✅ Admin accounts created by developer via seeder
- ✅ Instructor accounts created by admin
- ✅ Student self-registration
- ✅ Course management
- ✅ Student enrollment
- ✅ Attendance tracking
- ✅ Attendance percentage calculation
- ✅ Comprehensive reporting (daily, weekly, monthly)
- ✅ Notification system
- ✅ Schedule management

## Requirements

- PHP 8.2+
- Composer
- MySQL 8.0+
- Laravel 12.x

## Installation

1. **Install dependencies:**
   ```bash
   composer install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=student_attendance_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

4. **Run migrations:**
   ```bash
   php artisan migrate
   ```

5. **Seed the database (creates default admin account):**
   ```bash
   php artisan db:seed
   ```
   
   This creates a default admin account:
   - Email: `admin@example.com`
   - Password: `admin123`
   - ⚠️ **Important**: Change this password after first login!

6. **Start the development server:**
   ```bash
   php artisan serve
   ```

   The API will be available at `http://localhost:8000`

## Database Schema

### Tables
- `users` - User accounts with roles (admin, instructor, student)
- `courses` - Course information
- `enrollments` - Student-course relationships
- `schedules` - Class schedules
- `attendance` - Attendance records
- `notifications` - User notifications

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── AdminController.php
│   │   ├── CourseController.php
│   │   ├── ScheduleController.php
│   │   ├── AttendanceController.php
│   │   ├── ReportController.php
│   │   └── NotificationController.php
│   └── Middleware/
│       └── RoleMiddleware.php
├── Models/
│   ├── User.php
│   ├── Course.php
│   ├── Enrollment.php
│   ├── Schedule.php
│   ├── Attendance.php
│   └── Notification.php
└── Helpers/
    └── ApiResponse.php

database/
└── migrations/
    ├── create_users_table.php
    ├── create_courses_table.php
    ├── create_enrollments_table.php
    ├── create_schedules_table.php
    ├── create_attendance_table.php
    └── create_notifications_table.php

routes/
└── api.php
```

## Testing

Run tests:
```bash
php artisan test
```

## Seeding Data

The database seeder creates a default admin account for initial system access:

```bash
php artisan db:seed
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Security Note**: Change the default admin password immediately after first login!

### User Account Creation Flow
1. **Admin accounts**: Created by developers via `php artisan db:seed`
2. **Instructor accounts**: Created by admins through the admin dashboard
3. **Student accounts**: Self-registration through the `/register` endpoint

## Common Commands

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# View routes
php artisan route:list

# Create new controller
php artisan make:controller ControllerName

# Create new model
php artisan make:model ModelName

# Create new migration
php artisan make:migration migration_name
```

## Security

- All passwords are hashed using bcrypt
- API authentication via Laravel Sanctum tokens
- Role-based access control on all protected routes
- Input validation on all requests
- CSRF protection enabled

## License

This project is open-sourced software.
