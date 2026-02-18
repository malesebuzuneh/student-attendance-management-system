'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { reportService } from '@/services/reportService';
import { courseService } from '@/services/courseService';
import { authService } from '@/services/authService';

export default function InstructorReportsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      const user = authService.getStoredUser();
      if (user) {
        const response = await courseService.getCourses();
        // Handle different response structures
        const coursesData = response.data?.data || response.data || [];
        // Filter courses taught by this instructor
        const instructorCourses = Array.isArray(coursesData) 
          ? coursesData.filter((course: any) => course.instructor_id === user.id)
          : [];
        setCourses(instructorCourses);
        if (instructorCourses.length > 0) {
          setSelectedCourse(instructorCourses[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const generateReport = async () => {
    if (!selectedCourse) {
      alert('Please select a course');
      return;
    }

    setLoading(true);
    try {
      let params: any = {};
      
      if (reportType === 'daily') {
        params.date = date;
      } else if (reportType === 'weekly') {
        params.start_date = date;
      } else {
        params.month = month;
        params.year = year;
      }

      const response = await reportService.getCourseReport(parseInt(selectedCourse), params);
      // Handle different response structures
      const data = response.data || response;
      setReportData(data);
    } catch (error: any) {
      console.error('Error generating report:', error);
      const errorMessage = error.response?.data?.message || 'Error generating report. Please try again.';
      alert(errorMessage);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Course Attendance Reports</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Report</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {reportType === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            )}

            {reportType === 'weekly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            )}

            {reportType === 'monthly' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={m}>
                        {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                  />
                </div>
              </>
            )}
          </div>

          <button
            onClick={generateReport}
            disabled={loading || !selectedCourse}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>

        {reportData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Report Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-600">Total Records</div>
                <div className="text-2xl font-bold">{reportData.statistics?.total || 0}</div>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <div className="text-sm text-gray-600">Present</div>
                <div className="text-2xl font-bold text-green-600">{reportData.statistics?.present || 0}</div>
              </div>
              <div className="bg-red-50 p-4 rounded">
                <div className="text-sm text-gray-600">Absent</div>
                <div className="text-2xl font-bold text-red-600">{reportData.statistics?.absent || 0}</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <div className="text-sm text-gray-600">Late</div>
                <div className="text-2xl font-bold text-yellow-600">{reportData.statistics?.late || 0}</div>
              </div>
            </div>

            {reportData.records && reportData.records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.records.map((record: any, index: number) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{record.student?.name}</td>
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                No attendance records found for the selected period.
              </div>
            )}
          </div>
        )}

        {courses.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">You are not assigned to any courses yet.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
