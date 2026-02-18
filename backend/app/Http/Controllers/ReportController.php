<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Attendance;
use App\Models\Course;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    /**
     * Get daily attendance report.
     */
    public function getDailyReport(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date',
            ]);

            $attendance = Attendance::whereDate('date', $validated['date'])
                ->with(['student', 'course'])
                ->get();

            $statistics = $this->calculateStatistics($attendance);

            return ApiResponse::success([
                'date' => $validated['date'],
                'records' => $attendance,
                'statistics' => $statistics,
            ], 'Daily report generated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Get weekly attendance report.
     */
    public function getWeeklyReport(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
            ]);

            $startDate = Carbon::parse($validated['start_date']);
            $endDate = $startDate->copy()->addDays(6);

            $attendance = Attendance::whereBetween('date', [$startDate, $endDate])
                ->with(['student', 'course'])
                ->get();

            $statistics = $this->calculateStatistics($attendance);

            return ApiResponse::success([
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'records' => $attendance,
                'statistics' => $statistics,
            ], 'Weekly report generated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Get monthly attendance report.
     */
    public function getMonthlyReport(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'month' => 'required|integer|min:1|max:12',
                'year' => 'required|integer|min:2000|max:2100',
            ]);

            $startDate = Carbon::create($validated['year'], $validated['month'], 1);
            $endDate = $startDate->copy()->endOfMonth();

            $attendance = Attendance::whereBetween('date', [$startDate, $endDate])
                ->with(['student', 'course'])
                ->get();

            $statistics = $this->calculateStatistics($attendance);

            return ApiResponse::success([
                'month' => $validated['month'],
                'year' => $validated['year'],
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'records' => $attendance,
                'statistics' => $statistics,
            ], 'Monthly report generated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Get course-specific report.
     */
    public function getCourseReport(Request $request, $courseId): JsonResponse
    {
        try {
            $course = Course::findOrFail($courseId);

            // Verify instructor authorization
            if ($request->user()->role === 'instructor' && $course->instructor_id !== $request->user()->id) {
                return ApiResponse::error('You are not authorized to view this course report', 403);
            }

            $query = Attendance::where('course_id', $courseId)->with(['student', 'course']);

            // Apply date filters if provided
            if ($request->has('start_date') && $request->has('end_date')) {
                $validated = $request->validate([
                    'start_date' => 'required|date',
                    'end_date' => 'required|date|after_or_equal:start_date',
                ]);

                $query->whereBetween('date', [$validated['start_date'], $validated['end_date']]);
            }

            $attendance = $query->get();
            $statistics = $this->calculateStatistics($attendance);

            // Get student-wise statistics
            $studentStats = [];
            $enrolledStudents = $course->getEnrolledStudents();

            foreach ($enrolledStudents as $student) {
                $studentAttendance = $attendance->where('student_id', $student->id);
                $totalRecords = $studentAttendance->count();

                if ($totalRecords > 0) {
                    $attendedRecords = $studentAttendance->whereIn('status', ['present', 'late'])->count();
                    $percentage = ($attendedRecords / $totalRecords) * 100;

                    $studentStats[] = [
                        'student' => $student,
                        'total_sessions' => $totalRecords,
                        'attended_sessions' => $attendedRecords,
                        'percentage' => round($percentage, 2),
                        'present' => $studentAttendance->where('status', 'present')->count(),
                        'absent' => $studentAttendance->where('status', 'absent')->count(),
                        'late' => $studentAttendance->where('status', 'late')->count(),
                    ];
                }
            }

            return ApiResponse::success([
                'course' => $course,
                'records' => $attendance,
                'statistics' => $statistics,
                'student_statistics' => $studentStats,
            ], 'Course report generated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }

    /**
     * Calculate attendance statistics.
     */
    private function calculateStatistics($attendance): array
    {
        $total = $attendance->count();
        $present = $attendance->where('status', 'present')->count();
        $absent = $attendance->where('status', 'absent')->count();
        $late = $attendance->where('status', 'late')->count();

        return [
            'total' => $total,
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'attendance_rate' => $total > 0 ? round((($present + $late) / $total) * 100, 2) : 0,
        ];
    }
}
