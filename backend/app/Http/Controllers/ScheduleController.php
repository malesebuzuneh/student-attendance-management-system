<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Schedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ScheduleController extends Controller
{
    /**
     * Create a new schedule.
     */
    public function createSchedule(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'day' => 'required|string|max:20',
                'time' => 'required|date_format:H:i',
            ]);

            $schedule = Schedule::create($validated);

            return ApiResponse::success($schedule, 'Schedule created successfully', 201);

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Update an existing schedule.
     */
    public function updateSchedule(Request $request, $id): JsonResponse
    {
        try {
            $schedule = Schedule::findOrFail($id);

            $validated = $request->validate([
                'course_id' => 'sometimes|exists:courses,id',
                'day' => 'sometimes|string|max:20',
                'time' => 'sometimes|date_format:H:i',
            ]);

            $schedule->update($validated);

            return ApiResponse::success($schedule, 'Schedule updated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Schedule not found', 404);
        }
    }

    /**
     * Delete a schedule.
     */
    public function deleteSchedule($id): JsonResponse
    {
        try {
            $schedule = Schedule::findOrFail($id);
            $schedule->delete();

            return ApiResponse::success(null, 'Schedule deleted successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Schedule not found', 404);
        }
    }

    /**
     * Get schedules for a course.
     */
    public function getCourseSchedules($courseId): JsonResponse
    {
        try {
            $schedules = Schedule::where('course_id', $courseId)->get();

            return ApiResponse::success($schedules, 'Course schedules retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Error retrieving schedules', 500);
        }
    }
}
