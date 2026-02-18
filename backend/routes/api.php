<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);

    // Admin routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'listUsers']);
        Route::post('/users', [AdminController::class, 'createUser']);
        Route::put('/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    });

    // Course routes
    Route::get('/courses', [CourseController::class, 'listCourses']);
    Route::get('/courses/{id}', [CourseController::class, 'getCourse']);
    
    Route::middleware('role:admin')->group(function () {
        Route::post('/courses', [CourseController::class, 'createCourse']);
        Route::put('/courses/{id}', [CourseController::class, 'updateCourse']);
        Route::delete('/courses/{id}', [CourseController::class, 'deleteCourse']);
        Route::post('/enrollments', [CourseController::class, 'enrollStudent']);
        Route::delete('/enrollments/{id}', [CourseController::class, 'unenrollStudent']);
        
        // Schedule routes
        Route::post('/schedules', [ScheduleController::class, 'createSchedule']);
        Route::put('/schedules/{id}', [ScheduleController::class, 'updateSchedule']);
        Route::delete('/schedules/{id}', [ScheduleController::class, 'deleteSchedule']);
    });

    // Enrollment queries
    Route::get('/students/{studentId}/courses', [CourseController::class, 'getStudentCourses']);
    Route::get('/courses/{courseId}/students', [CourseController::class, 'getCourseStudents']);
    
    // Schedule queries
    Route::get('/courses/{courseId}/schedules', [ScheduleController::class, 'getCourseSchedules']);
    
    // Attendance routes
    Route::middleware('role:instructor,admin')->group(function () {
        Route::post('/attendance', [AttendanceController::class, 'markAttendance']);
        Route::put('/attendance/{id}', [AttendanceController::class, 'updateAttendance']);
        Route::get('/courses/{courseId}/attendance/low', [AttendanceController::class, 'getLowAttendanceStudents']);
        Route::get('/courses/{courseId}/attendance/range', [AttendanceController::class, 'getAttendanceByDateRange']);
    });
    
    Route::get('/courses/{courseId}/attendance', [AttendanceController::class, 'getCourseAttendance']);
    Route::get('/students/{studentId}/attendance', [AttendanceController::class, 'getStudentAttendance']);
    Route::get('/students/{studentId}/courses/{courseId}/percentage', [AttendanceController::class, 'getAttendancePercentage']);
    
    // Report routes
    Route::middleware('role:admin,instructor')->group(function () {
        Route::get('/reports/daily', [ReportController::class, 'getDailyReport']);
        Route::get('/reports/weekly', [ReportController::class, 'getWeeklyReport']);
        Route::get('/reports/monthly', [ReportController::class, 'getMonthlyReport']);
        Route::get('/reports/course/{courseId}', [ReportController::class, 'getCourseReport']);
    });
    
    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'getUserNotifications']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications', [NotificationController::class, 'createNotification']);
});
