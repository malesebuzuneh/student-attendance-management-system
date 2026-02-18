'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { authService } from '@/services/authService';
import { courseService } from '@/services/courseService';
import { attendanceService } from '@/services/attendanceService';

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    setUser(storedUser);
    if (storedUser) {
      fetchData(storedUser.id);
    }
  }, []);

  const fetchData = async (studentId: number) => {
    try {
      const [coursesResponse, attendanceResponse] = await Promise.all([
        courseService.getStudentCourses(studentId),
        attendanceService.getStudentAttendance(studentId),
      ]);

      const studentCourses = coursesResponse.data || [];
      setCourses(studentCourses);

      const attendance = attendanceResponse.data || [];
      setAttendanceData(attendance);

      // Calculate percentages for each course
      const coursePercentages = await Promise.all(
        studentCourses.map(async (course: any) => {
          try {
            const percentageResponse = await attendanceService.getAttendancePercentage(studentId, course.id);
            return {
              courseId: course.id,
              ...percentageResponse.data,
            };
          } catch (error) {
            return { courseId: course.id, percentage: 0 };
          }
        })
      );

      setCourses(studentCourses.map((course: any) => ({
        ...course,
        attendanceData: coursePercentages.find((p: any) => p.courseId === course.id),
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const totalAbsences = attendanceData.filter((a: any) => a.status === 'absent').length;
  const recentAttendance = attendanceData.slice(0, 5);

  return (
    <Layout>
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">Here's your attendance overview</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Enrolled Courses</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{courses.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Absences</div>
            <div className="mt-2 text-3xl font-bold text-red-600">{totalAbsences}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Records</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{attendanceData.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Attendance</h2>
            <div className="space-y-4">
              {courses.map((course) => {
                const percentage = course.attendanceData?.percentage || 0;
                const isLow = percentage < 75;
                
                return (
                  <div key={course.id} className={`p-4 rounded-lg ${isLow ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <span className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${isLow ? 'bg-red-600' : 'bg-green-600'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {isLow && (
                      <p className="text-xs text-red-600 mt-2">⚠️ Low attendance warning</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Attendance</h2>
            <div className="space-y-3">
              {recentAttendance.map((record: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-gray-900">{record.course?.title}</div>
                    <div className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'present' ? 'bg-green-100 text-green-800' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
