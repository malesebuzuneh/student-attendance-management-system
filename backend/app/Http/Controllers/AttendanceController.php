<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Attendance;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AttendanceController extends Controller
{
    /**
     * Mark attendance for a student.
     */
    public function markAttendance(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'student_id' => 'required|exists:users,id',
                'date' => 'required|date',
                'status' => 'required|in:present,absent,late',
            ]);

            // Verify instructor authorization
            $course = Course::findOrFail($validated['course_id']);
            if ($request->user()->role === 'instructor' && $course->instructor_id !== $request->user()->id) {
                return ApiResponse::error('You are not authorized to mark attendance for this course', 403);
            }

            // Verify student is enrolled
            $enrollment = Enrollment::where('student_id', $validated['student_id'])
                ->where('course_id', $validated['course_id'])
                ->first();

            if (!$enrollment) {
                return ApiResponse::error('Student is not enrolled in this course', 422);
            }

            // Check for duplicate attendance
            $existingAttendance = Attendance::where('course_id', $validated['course_id'])
                ->where('student_id', $validated['student_id'])
                ->where('date', $validated['date'])
                ->first();

            if ($existingAttendance) {
                return ApiResponse::error('Attendance already marked for this student on this date', 422);
            }

            $attendance = Attendance::create($validated);

            return ApiResponse::success($attendance, 'Attendance marked successfully', 201);

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Update an existing attendance record.
     */
    public function updateAttendance(Request $request, $id): JsonResponse
    {
        try {
            $attendance = Attendance::findOrFail($id);

            // Verify instructor authorization
            $course = Course::findOrFail($attendance->course_id);
            if ($request->user()->role === 'instructor' && $course->instructor_id !== $request->user()->id) {
                return ApiResponse::error('You are not authorized to update attendance for this course', 403);
            }

            $validated = $request->validate([
                'status' => 'required|in:present,absent,late',
            ]);

            $attendance->update($validated);

            return ApiResponse::success($attendance, 'Attendance updated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Attendance record not found', 404);
        }
    }

    /**
     * Get attendance records for a course.
     */
    public function getCourseAttendance($courseId): JsonResponse
    {
        try {
            $course = Course::findOrFail($courseId);
            $attendance = Attendance::where('course_id', $courseId)
                ->with(['student', 'course'])
                ->get();

            return ApiResponse::success($attendance, 'Course attendance retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }

    /**
     * Get attendance records for a student.
     */
    public function getStudentAttendance(Request $request, $studentId): JsonResponse
    {
        try {
            $student = User::findOrFail($studentId);

            // Students can only view their own attendance
            if ($request->user()->role === 'student' && $request->user()->id != $studentId) {
                return ApiResponse::error('You can only view your own attendance records', 403);
            }

            $attendance = Attendance::where('student_id', $studentId)
                ->with(['course', 'student'])
                ->get();

            return ApiResponse::success($attendance, 'Student attendance retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Student not found', 404);
        }
    }

    /**
     * Get attendance percentage for a student in a course.
     */
    public function getAttendancePercentage($studentId, $courseId): JsonResponse
    {
        try {
            $student = User::findOrFail($studentId);
            $course = Course::findOrFail($courseId);

            $totalRecords = Attendance::where('student_id', $studentId)
                ->where('course_id', $courseId)
                ->where('date', '<=', now())
                ->count();

            if ($totalRecords === 0) {
                return ApiResponse::success([
                    'percentage' => 0,
                    'total_sessions' => 0,
                    'attended_sessions' => 0,
                ], 'Attendance percentage calculated');
            }

            $attendedRecords = Attendance::where('student_id', $studentId)
                ->where('course_id', $courseId)
                ->where('date', '<=', now())
                ->whereIn('status', ['present', 'late'])
                ->count();

            $percentage = ($attendedRecords / $totalRecords) * 100;

            return ApiResponse::success([
                'percentage' => round($percentage, 2),
                'total_sessions' => $totalRecords,
                'attended_sessions' => $attendedRecords,
            ], 'Attendance percentage calculated');

        } catch (\Exception $e) {
            return ApiResponse::error('Student or course not found', 404);
        }
    }

    /**
     * Get students with low attendance in a course.
     */
    public function getLowAttendanceStudents(Request $request, $courseId): JsonResponse
    {
        try {
            $threshold = $request->query('threshold', 75);
            $course = Course::findOrFail($courseId);

            // Verify instructor authorization
            if ($request->user()->role === 'instructor' && $course->instructor_id !== $request->user()->id) {
                return ApiResponse::error('You are not authorized to view this course data', 403);
            }

            $enrolledStudents = Enrollment::where('course_id', $courseId)->get();
            $lowAttendanceStudents = [];

            foreach ($enrolledStudents as $enrollment) {
                $totalRecords = Attendance::where('student_id', $enrollment->student_id)
                    ->where('course_id', $courseId)
                    ->where('date', '<=', now())
                    ->count();

                if ($totalRecords > 0) {
                    $attendedRecords = Attendance::where('student_id', $enrollment->student_id)
                        ->where('course_id', $courseId)
                        ->where('date', '<=', now())
                        ->whereIn('status', ['present', 'late'])
                        ->count();

                    $percentage = ($attendedRecords / $totalRecords) * 100;

                    if ($percentage < $threshold) {
                        $lowAttendanceStudents[] = [
                            'student' => $enrollment->student,
                            'percentage' => round($percentage, 2),
                            'total_sessions' => $totalRecords,
                            'attended_sessions' => $attendedRecords,
                        ];
                    }
                }
            }

            return ApiResponse::success($lowAttendanceStudents, 'Low attendance students retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }

    /**
     * Get attendance records with date range filtering.
     */
    public function getAttendanceByDateRange(Request $request, $courseId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            $course = Course::findOrFail($courseId);

            // Verify instructor authorization
            if ($request->user()->role === 'instructor' && $course->instructor_id !== $request->user()->id) {
                return ApiResponse::error('You are not authorized to view this course data', 403);
            }

            $attendance = Attendance::where('course_id', $courseId)
                ->whereBetween('date', [$validated['start_date'], $validated['end_date']])
                ->with(['student', 'course'])
                ->get();

            return ApiResponse::success($attendance, 'Attendance records retrieved successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }
}
