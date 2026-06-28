import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { FiUser, FiMail, FiCalendar, FiCheckSquare, FiAward, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

const Profile = () => {
  const { user } = useAuth();
  const { stats } = useTasks();

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const joinDate = user?.createdAt ? format(new Date(user.createdAt), 'MMMM dd, yyyy') : 'Recently';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-soft flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Backdrop Glow Decorator */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -z-10" />

        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`}
          alt="avatar"
          className="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-md"
        />

        <div className="text-center sm:text-left space-y-1">
          <h2 className="font-heading font-bold text-2xl text-slate-900">{user?.name}</h2>
          <p className="text-sm text-indigo-600 font-medium">TaskFlow Member</p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-xs text-slate-400 pt-2 font-medium">
            <span className="flex items-center gap-1">
              <FiMail className="w-3.5 h-3.5" />
              {user?.email}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar className="w-3.5 h-3.5" />
              Joined {joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Task Performance Analytics */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-soft space-y-6">
        <div>
          <h3 className="font-heading font-semibold text-lg text-slate-800">Task Statistics</h3>
          <p className="text-xs text-slate-400 mt-1">Review your overall performance and work rates</p>
        </div>

        {/* Big numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
            <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider">Total Handled</p>
            <h4 className="font-heading font-bold text-3xl text-slate-800 mt-2">{stats.total}</h4>
          </div>
          <div className="p-4 bg-green-50/30 border border-green-100 rounded-2xl text-center">
            <p className="text-xs font-semibold text-green-700/70 uppercase tracking-wider">Completed</p>
            <h4 className="font-heading font-bold text-3xl text-green-800 mt-2">{stats.completed}</h4>
          </div>
          <div className="p-4 bg-amber-50/30 border border-amber-100 rounded-2xl text-center col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold text-amber-700/70 uppercase tracking-wider">Completion Rate</p>
            <h4 className="font-heading font-bold text-3xl text-amber-800 mt-2">{completionRate}%</h4>
          </div>
        </div>

        {/* Motivational Status Card */}
        <div className="p-5 border border-indigo-100 bg-indigo-50/30 rounded-2xl flex items-start gap-4">
          <div className="p-2.5 bg-indigo-100 text-indigo-650 rounded-xl">
            <FiAward className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-slate-800 text-sm">
              {completionRate === 100 && stats.total > 0
                ? 'Work Completed! Excellent Job!'
                : completionRate >= 70
                ? 'Keep up the solid pace!'
                : stats.total === 0
                ? 'Welcome aboard!'
                : 'Plan and tackle pending tasks!'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {completionRate === 100 && stats.total > 0
                ? 'You have fully finished all assigned tasks. Stay organized!'
                : completionRate >= 70
                ? 'You are closing in on completing all tasks. You have only a few left!'
                : stats.total === 0
                ? 'Create a few tasks using the top menu to populate your board and track items.'
                : `You currently have ${stats.todo + stats.inProgress} pending task(s) active on your dashboard.`}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
