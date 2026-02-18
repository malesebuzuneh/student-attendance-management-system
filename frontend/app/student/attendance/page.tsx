'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { authService } from '@/services/authService';
import { attendanceService } from '@/services/attendanceService';

export default function StudentAttendancePage() {
  const [user, setUser] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    setUser(storedUser);
    if (storedUser) {
      fetchAttendance(storedUser.id);
    }
  }, []);

  useEffect(() => {
    if (selectedCourse === 'all') {
      setFilteredAttendance(attendance);
    } else {
      setFilteredAttendance(attendance.filter((a: any) => a.course_id.toString() === selectedCourse));
    }
  }, [selectedCourse, attendance]);

  const fetchAttendance = async (studentId: number) => {
    try {
      const response = await attendanceService.getStudentAttendance(studentId);
      const records = response.data || [];
      setAttendance(records);
      setFilteredAttendance(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
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

  const courses = Array.from(new Set(attendance.map((a: any) => a.course?.title))).filter(Boolean);

  return (
    <Layout>
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Attendance Records</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
            <select
              className="border border-gray-300 rounded-md px-4 py-2"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map((course: any, index: number) => (
                <option key={index} value={attendance.find((a: any) => a.course?.title === course)?.course_id}>
                  {course}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.course?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <p className="text-center text-gray-500 py-8">No attendance records found</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
