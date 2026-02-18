# Student Attendance Management System

A full-stack web application for managing student attendance in educational institutions. Built with Laravel (backend) and Next.js (frontend).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Laravel](https://img.shields.io/badge/Laravel-12-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)

## 🎯 Features

### Role-Based Access Control
- **Admin**: System administrators with full access
- **Instructor**: Teachers who mark and view attendance
- **Student**: Students who view their attendance records

### Core Functionality
- ✅ User authentication with Laravel Sanctum
- ✅ Role-based dashboards
- ✅ Course management
- ✅ Student enrollment
- ✅ Attendance marking (Present, Absent, Late)
- ✅ Attendance percentage calculation
- ✅ Low attendance warnings (< 75%)
- ✅ Comprehensive reporting (Daily, Weekly, Monthly)
- ✅ Notification system
- ✅ Responsive design

## 🏗️ Architecture

```
├── backend/          # Laravel REST API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Helpers/
│   └── database/
│       ├── migrations/
│       └── seeders/
│
└── frontend/         # Next.js Frontend
    ├── app/
    │   ├── admin/
    │   ├── instructor/
    │   └── student/
    ├── components/
    └── services/
```

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL or SQLite

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   composer install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials.

4. **Generate application key:**
   ```bash
   php artisan key:generate
   ```

5. **Run migrations:**
   ```bash
   php artisan migrate
   ```

6. **Seed database (creates admin account):**
   ```bash
   php artisan db:seed
   ```
   
   Default admin credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`

7. **Start server:**
   ```bash
   php artisan serve
   ```
   
   Backend runs on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Or create `.env.local` with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend runs on `http://localhost:3000`

## 👥 User Roles & Permissions

### Admin
- Manage users (create instructors and students)
- Manage courses
- Enroll students in courses
- Generate system-wide reports
- View all system data

### Instructor
- View assigned courses
- Mark student attendance
- View course attendance records
- Generate course-specific reports
- Identify students with low attendance

### Student
- View enrolled courses
- View personal attendance records
- Track attendance percentage
- Receive low attendance warnings

## 📊 Account Creation Flow

1. **Admin accounts** → Created by developers via `php artisan db:seed`
2. **Instructor accounts** → Created by admins through admin dashboard
3. **Student accounts** → Self-registration at `/register`

## 🔐 Security Features

- Token-based authentication (Laravel Sanctum)
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Input validation
- Admin account protection (cannot be deleted via UI)

## 📱 Screenshots

### Admin Dashboard
Manage users, courses, and view system statistics.

### Instructor Dashboard
Mark attendance and view course reports.

### Student Dashboard
View attendance records and percentages.

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 12
- **Database**: MySQL / SQLite
- **Authentication**: Laravel Sanctum
- **ORM**: Eloquent

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## 📚 API Documentation

See [backend/API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) for complete API reference.

### Key Endpoints

```
POST   /api/register          # Student registration
POST   /api/login             # User login
GET    /api/courses           # List courses
POST   /api/attendance        # Mark attendance
GET    /api/reports/daily     # Daily report
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
php artisan test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Database Schema

### Main Tables
- `users` - User accounts with roles
- `courses` - Course information
- `enrollments` - Student-course relationships
- `schedules` - Class schedules
- `attendance` - Attendance records
- `notifications` - User notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the MIT license.

## 👨‍💻 Author

**Melese Buzuneh**
- GitHub: [@malesebuzuneh](https://github.com/malesebuzuneh)

## 🙏 Acknowledgments

- Laravel Framework
- Next.js Team
- Tailwind CSS
- All contributors

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] PDF report export
- [ ] Mobile app (React Native)
- [ ] QR code attendance
- [ ] Parent portal
- [ ] Real-time updates with WebSockets
- [ ] Advanced analytics dashboard

---

Made with ❤️ by Melese Buzuneh
