import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import {
  FiGrid,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlus,
  FiBell,
  FiCheckSquare,
  FiChevronDown
} from 'react-icons/fi';

const Layout = ({ children, onCreateTaskClick }) => {
  const { user, logout } = useAuth();
  const { stats } = useTasks();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiGrid className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <FiUser className="w-5 h-5" /> },
  ];

  const totalNotifications = (stats.dueSoon || 0) + (stats.overdue || 0);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-slate-900 text-white border-r border-slate-800 fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <FiCheckSquare className="w-6 h-6" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight">TaskFlow</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 gap-3 font-medium ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-premium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Drawer Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white border-r border-slate-800 flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <FiCheckSquare className="w-6 h-6" />
            </div>
            <span className="font-heading font-bold text-xl">TaskFlow</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-850 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl gap-3 font-medium transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h1 className="font-heading font-semibold text-lg text-slate-800 hidden md:block">
              {location.pathname === '/dashboard'
                ? 'Task Workspace'
                : location.pathname === '/profile'
                ? 'User Profile'
                : 'Task Details'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {onCreateTaskClick && (
              <button
                onClick={onCreateTaskClick}
                className="flex items-center bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-premium gap-2 cursor-pointer"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            )}

            <div className="relative">
              <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors relative">
                <FiBell className="w-5 h-5" />
                {totalNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200" />

            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition-colors"
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-indigo-100"
                />
                <FiChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-medium text-sm text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {location.pathname === '/dashboard' && totalNotifications > 0 && (
          <div className="mx-6 mt-6 p-4 rounded-xl flex items-center justify-between border shadow-soft bg-rose-50/50 border-rose-100/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <FiBell className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800">Urgent Task Reminders</p>
                <p className="text-xs text-slate-500">
                  {stats.overdue > 0 ? `${stats.overdue} task(s) are overdue. ` : ''}
                  {stats.dueSoon > 0 ? `${stats.dueSoon} task(s) are due within 48 hours.` : ''}
                </p>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
