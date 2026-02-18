'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResponse, coursesResponse] = await Promise.all([
        userService.getUsers(),
        courseService.getCourses(),
      ]);

      const users = usersResponse.data.data || [];
      const courses = coursesResponse.data || [];

      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalStudents: users.filter((u: any) => u.role === 'student').length,
        totalInstructors: users.filter((u: any) => u.role === 'instructor').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Total Courses</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalCourses}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Students</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalStudents}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">Instructors</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.totalInstructors}</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/admin/users" className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-900">Manage Users</h3>
            <p className="mt-2 text-gray-600">Create, edit, and delete user accounts</p>
          </a>
          
          <a href="/admin/courses" className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-900">Manage Courses</h3>
            <p className="mt-2 text-gray-600">Create and manage courses and enrollments</p>
          </a>
          
          <a href="/admin/reports" className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-900">View Reports</h3>
            <p className="mt-2 text-gray-600">Generate attendance reports and analytics</p>
          </a>
        </div>
      </div>
    </Layout>
  );
}
