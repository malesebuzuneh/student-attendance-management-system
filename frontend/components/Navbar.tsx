'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    setUser(storedUser);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Student Attendance System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user.role === 'admin' && (
              <>
                <a href="/admin/dashboard" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Dashboard</a>
                <a href="/admin/users" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Users</a>
                <a href="/admin/courses" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Courses</a>
                <a href="/admin/reports" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Reports</a>
              </>
            )}
            
            {user.role === 'instructor' && (
              <>
                <a href="/instructor/dashboard" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Dashboard</a>
                <a href="/instructor/courses" className="hover:bg-indigo-700 px-3 py-2 rounded-md">My Courses</a>
                <a href="/instructor/reports" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Reports</a>
              </>
            )}
            
            {user.role === 'student' && (
              <>
                <a href="/student/dashboard" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Dashboard</a>
                <a href="/student/courses" className="hover:bg-indigo-700 px-3 py-2 rounded-md">My Courses</a>
                <a href="/student/attendance" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Attendance</a>
              </>
            )}
            
            <div className="border-l border-indigo-500 pl-4">
              <span className="mr-2">{user.name}</span>
              <span className="text-xs bg-indigo-800 px-2 py-1 rounded">{user.role}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
