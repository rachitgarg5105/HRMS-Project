import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Users, Calendar, Home, Clock, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
    isActive
      ? 'border-indigo-500 text-gray-900'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
  }`;

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">HR Management</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink to="/dashboard" className={linkClass}>
                  <Home className="w-4 h-4 mr-1" />
                  Dashboard
                </NavLink>
                <NavLink to="/employees" className={linkClass}>
                  <Users className="w-4 h-4 mr-1" />
                  Employees
                </NavLink>
                <NavLink to="/attendance" className={linkClass}>
                  <Clock className="w-4 h-4 mr-1" />
                  Attendance
                </NavLink>
                <NavLink to="/leave-requests" className={linkClass}>
                  <FileText className="w-4 h-4 mr-1" />
                  Leave Requests
                </NavLink>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:inline">
                <span className="text-gray-400">Signed in as </span>
                <span className="font-medium text-gray-800">{user?.username}</span>
                {user?.role === 'admin' && (
                  <span className="ml-2 text-xs uppercase tracking-wide text-indigo-600">Admin</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
