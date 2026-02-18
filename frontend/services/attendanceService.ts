import axios from '@/lib/axios';

export interface AttendanceData {
  course_id: number;
  student_id: number;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export const attendanceService = {
  markAttendance: async (data: AttendanceData) => {
    const response = await axios.post('/attendance', data);
    return response.data;
  },

  updateAttendance: async (id: number, status: 'present' | 'absent' | 'late') => {
    const response = await axios.put(`/attendance/${id}`, { status });
    return response.data;
  },

  getCourseAttendance: async (courseId: number) => {
    const response = await axios.get(`/courses/${courseId}/attendance`);
    return response.data;
  },

  getStudentAttendance: async (studentId: number) => {
    const response = await axios.get(`/students/${studentId}/attendance`);
    return response.data;
  },

  getAttendancePercentage: async (studentId: number, courseId: number) => {
    const response = await axios.get(`/students/${studentId}/courses/${courseId}/percentage`);
    return response.data;
  },

  getLowAttendanceStudents: async (courseId: number, threshold: number = 75) => {
    const response = await axios.get(`/courses/${courseId}/attendance/low?threshold=${threshold}`);
    return response.data;
  },

  getAttendanceByDateRange: async (courseId: number, startDate: string, endDate: string) => {
    const response = await axios.get(`/courses/${courseId}/attendance/range`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};
