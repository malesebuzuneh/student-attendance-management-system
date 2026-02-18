<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first student
        $student = User::where('role', 'student')->first();
        
        // Get the first course
        $course = Course::first();
        
        if ($student && $course) {
            // Create enrollment if it doesn't exist
            Enrollment::firstOrCreate([
                'student_id' => $student->id,
                'course_id' => $course->id,
            ]);
            
            echo "✅ Enrolled {$student->name} in {$course->title}\n";
        } else {
            echo "⚠️  Student or course not found. Please create them first.\n";
        }
    }
}
