import axios from '@/lib/axios';

export interface CourseData {
  title: string;
  description?: string;
  instructor_id: number;
}

export interface EnrollmentData {
  student_id: number;
  course_id: number;
}

export const courseService = {
  getCourses: async () => {
    const response = await axios.get('/courses');
    return response.data;
  },

  getCourse: async (id: number) => {
    const response = await axios.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (data: CourseData) => {
    const response = await axios.post('/courses', data);
    return response.data;
  },

  updateCourse: async (id: number, data: Partial<CourseData>) => {
    const response = await axios.put(`/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id: number) => {
    const response = await axios.delete(`/courses/${id}`);
    return response.data;
  },

  enrollStudent: async (data: EnrollmentData) => {
    const response = await axios.post('/enrollments', data);
    return response.data;
  },

  unenrollStudent: async (enrollmentId: number) => {
    const response = await axios.delete(`/enrollments/${enrollmentId}`);
    return response.data;
  },

  getStudentCourses: async (studentId: number) => {
    const response = await axios.get(`/students/${studentId}/courses`);
    return response.data;
  },

  getCourseStudents: async (courseId: number) => {
    const response = await axios.get(`/courses/${courseId}/students`);
    return response.data;
  },
};
