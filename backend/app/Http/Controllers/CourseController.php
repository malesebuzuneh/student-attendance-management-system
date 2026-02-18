<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CourseController extends Controller
{
    /**
     * Get all courses.
     */
    public function listCourses(): JsonResponse
    {
        $courses = Course::with('instructor')->get();
        return ApiResponse::success($courses, 'Courses retrieved successfully');
    }

    /**
     * Get a single course.
     */
    public function getCourse($id): JsonResponse
    {
        try {
            $course = Course::with(['instructor', 'enrollments.student'])->findOrFail($id);
            return ApiResponse::success($course, 'Course retrieved successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }

    /**
     * Create a new course.
     */
    public function createCourse(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'instructor_id' => 'required|exists:users,id',
            ]);

            // Verify instructor role
            $instructor = User::findOrFail($validated['instructor_id']);
            if ($instructor->role !== 'instructor') {
                return ApiResponse::error('The selected user is not an instructor', 422);
            }

            $course = Course::create($validated);

            return ApiResponse::success($course, 'Course created successfully', 201);

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Update an existing course.
     */
    public function updateCourse(Request $request, $id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'instructor_id' => 'sometimes|exists:users,id',
            ]);

            // Verify instructor role if instructor_id is being updated
            if (isset($validated['instructor_id'])) {
                $instructor = User::findOrFail($validated['instructor_id']);
                if ($instructor->role !== 'instructor') {
                    return ApiResponse::error('The selected user is not an instructor', 422);
                }
            }

            $course->update($validated);

            return ApiResponse::success($course, 'Course updated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }

    /**
     * Delete a course.
     */
    public function deleteCourse($id): JsonResponse
    {
        try {
            $course = Course::findOrFail($id);
            $course->delete();

            return ApiResponse::success(null, 'Course deleted successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }

    /**
     * Enroll a student in a course.
     */
    public function enrollStudent(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required|exists:users,id',
                'course_id' => 'required|exists:courses,id',
            ]);

            // Verify student role
            $student = User::findOrFail($validated['student_id']);
            if ($student->role !== 'student') {
                return ApiResponse::error('The selected user is not a student', 422);
            }

            // Check for duplicate enrollment
            $existingEnrollment = Enrollment::where('student_id', $validated['student_id'])
                ->where('course_id', $validated['course_id'])
                ->first();

            if ($existingEnrollment) {
                return ApiResponse::error('Student is already enrolled in this course', 422);
            }

            $enrollment = Enrollment::create($validated);

            return ApiResponse::success($enrollment, 'Student enrolled successfully', 201);

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Unenroll a student from a course.
     */
    public function unenrollStudent($id): JsonResponse
    {
        try {
            $enrollment = Enrollment::findOrFail($id);
            $enrollment->delete();

            return ApiResponse::success(null, 'Student unenrolled successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Enrollment not found', 404);
        }
    }

    /**
     * Get courses for a student.
     */
    public function getStudentCourses($studentId): JsonResponse
    {
        try {
            $student = User::findOrFail($studentId);
            
            if ($student->role !== 'student') {
                return ApiResponse::error('The selected user is not a student', 422);
            }

            $courses = $student->studentEnrollments()->with('course.instructor')->get()->pluck('course');

            return ApiResponse::success($courses, 'Student courses retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Student not found', 404);
        }
    }

    /**
     * Get students enrolled in a course.
     */
    public function getCourseStudents($courseId): JsonResponse
    {
        try {
            $course = Course::findOrFail($courseId);
            $students = $course->getEnrolledStudents();

            return ApiResponse::success($students, 'Course students retrieved successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('Course not found', 404);
        }
    }
}
