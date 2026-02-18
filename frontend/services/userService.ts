import axios from '@/lib/axios';

export interface UserData {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'instructor' | 'student';
}

export const userService = {
  getUsers: async () => {
    const response = await axios.get('/admin/users');
    return response.data;
  },

  createUser: async (data: UserData) => {
    const response = await axios.post('/admin/users', data);
    return response.data;
  },

  updateUser: async (id: number, data: Partial<UserData>) => {
    const response = await axios.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await axios.delete(`/admin/users/${id}`);
    return response.data;
  },
};
