'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { authService } from '@/services/authService';
import { courseService } from '@/services/courseService';
import { attendanceService } from '@/services/attendanceService';

export default function StudentCoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    setUser(storedUser);
    if (storedUser) {
      fetchCourses(storedUser.id);
    }
  }, []);

  const fetchCourses = async (studentId: number) => {
    try {
      const response = await courseService.getStudentCourses(studentId);
      const studentCourses = response.data || [];

      // Fetch attendance percentage for each course
      const coursesWithPercentage = await Promise.all(
        studentCourses.map(async (course: any) => {
          try {
            const percentageResponse = await attendanceService.getAttendancePercentage(studentId, course.id);
            return {
              ...course,
              attendanceData: percentageResponse.data,
            };
          } catch (error) {
            return {
              ...course,
              attendanceData: { percentage: 0, total_sessions: 0, attended_sessions: 0 },
            };
          }
        })
      );

      setCourses(coursesWithPercentage);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const percentage = course.attendanceData?.percentage || 0;
            const isLow = percentage < 75;

            return (
              <div key={course.id} className={`bg-white rounded-lg shadow p-6 ${isLow ? 'border-2 border-red-300' : ''}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Attendance</span>
                    <span className={`font-semibold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isLow ? 'bg-red-600' : 'bg-green-600'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div>Sessions: {course.attendanceData?.total_sessions || 0}</div>
                  <div>Attended: {course.attendanceData?.attended_sessions || 0}</div>
                </div>

                {isLow && (
                  <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-xs text-red-600">⚠️ Low attendance warning</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">You are not enrolled in any courses yet</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
