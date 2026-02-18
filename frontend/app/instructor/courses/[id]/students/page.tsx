'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { courseService } from '@/services/courseService';
import { attendanceService } from '@/services/attendanceService';

export default function CourseStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id as string);
  
  const [course, setCourse] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentsWithAttendance, setStudentsWithAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseResponse, studentsResponse] = await Promise.all([
        courseService.getCourse(courseId),
        courseService.getCourseStudents(courseId),
      ]);

      const courseData = courseResponse.data?.data || courseResponse.data;
      const studentsData = studentsResponse.data?.data || studentsResponse.data || [];
      
      setCourse(courseData);
      setStudents(studentsData);

      // Fetch attendance percentage for each student
      const studentsWithPercentage = await Promise.all(
        studentsData.map(async (student: any) => {
          try {
            const percentageResponse = await attendanceService.getAttendancePercentage(
              student.id,
              courseId
            );
            const percentage = percentageResponse.data?.data?.percentage || 
                             percentageResponse.data?.percentage || 0;
            return {
              ...student,
              attendancePercentage: percentage,
            };
          } catch (error) {
            return {
              ...student,
              attendancePercentage: 0,
            };
          }
        })
      );

      setStudentsWithAttendance(studentsWithPercentage);
    } catch (error) {
      console.error('Error fetching course data:', error);
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
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 mb-4"
          >
            ← Back to Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
          <p className="text-gray-600">{course?.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Enrolled Students ({studentsWithAttendance.length})
            </h2>
          </div>

          {studentsWithAttendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Attendance %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsWithAttendance.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {student.attendancePercentage.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.attendancePercentage < 75 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low Attendance
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Good
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => router.push(`/instructor/courses/${courseId}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Attendance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No students enrolled in this course yet.</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push(`/instructor/courses/${courseId}`)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Mark Attendance
          </button>
        </div>
      </div>
    </Layout>
  );
}
