import axios from '@/lib/axios';

export interface ReportParams {
  start_date?: string;
  end_date?: string;
}

export const reportService = {
  getDailyReport: async (date: string) => {
    const response = await axios.get('/reports/daily', { params: { date } });
    return response.data;
  },

  getWeeklyReport: async (startDate: string) => {
    const response = await axios.get('/reports/weekly', { params: { start_date: startDate } });
    return response.data;
  },

  getMonthlyReport: async (month: number, year: number) => {
    const response = await axios.get('/reports/monthly', { params: { month, year } });
    return response.data;
  },

  getCourseReport: async (courseId: number, params?: ReportParams) => {
    const response = await axios.get(`/reports/course/${courseId}`, { params });
    return response.data;
  },
};
