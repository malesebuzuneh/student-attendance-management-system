'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { courseService } from '@/services/courseService';
import { attendanceService } from '@/services/attendanceService';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = parseInt(params.id as string);
  
  const [course, setCourse] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMarks, setAttendanceMarks] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const [courseResponse, studentsResponse] = await Promise.all([
        courseService.getCourse(courseId),
        courseService.getCourseStudents(courseId),
      ]);

      setCourse(courseResponse.data);
      setStudents(studentsResponse.data || []);
      
      // Initialize attendance marks
      const marks: { [key: number]: string } = {};
      (studentsResponse.data || []).forEach((student: any) => {
        marks[student.id] = 'present';
      });
      setAttendanceMarks(marks);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    setSaving(true);
    try {
      const promises = students.map((student) =>
        attendanceService.markAttendance({
          course_id: courseId,
          student_id: student.id,
          date: selectedDate,
          status: attendanceMarks[student.id] as any,
        })
      );

      await Promise.all(promises);
      alert('Attendance marked successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error marking attendance');
    } finally {
      setSaving(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course?.title}</h1>
        <p className="text-gray-600 mb-8">{course?.description}</p>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mark Attendance</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-4 py-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="border border-gray-300 rounded-md px-3 py-1"
                        value={attendanceMarks[student.id]}
                        onChange={(e) => setAttendanceMarks({
                          ...attendanceMarks,
                          [student.id]: e.target.value,
                        })}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <p className="text-center text-gray-500 py-8">No students enrolled in this course</p>
          )}

          {students.length > 0 && (
            <div className="mt-6">
              <button
                onClick={handleMarkAttendance}
                disabled={saving}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
