import React from 'react';
import { FiList, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const StatsCards = ({ stats }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const cardData = [
    {
      title: 'Total Tasks',
      value: stats.total || 0,
      icon: <FiList className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-150',
      textColor: 'text-indigo-900',
      description: 'Total active & archived',
    },
    {
      title: 'To Do',
      value: stats.todo || 0,
      icon: <FiClock className="w-5 h-5 text-slate-600" />,
      bg: 'bg-slate-50 border-slate-200',
      textColor: 'text-slate-900',
      description: 'Tasks in backlog',
    },
    {
      title: 'In Progress',
      value: stats.inProgress || 0,
      icon: <FiClock className="w-5 h-5 text-amber-600 animate-spin-slow" />,
      bg: 'bg-amber-50 border-amber-150',
      textColor: 'text-amber-900',
      description: 'Currently working on',
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      icon: <FiCheckCircle className="w-5 h-5 text-green-600" />,
      bg: 'bg-green-50 border-green-150',
      textColor: 'text-green-900',
      description: `${completionRate}% completion rate`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-2xl border shadow-soft flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.bg}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{card.title}</span>
            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">{card.icon}</div>
          </div>
          <div className="mt-4">
            <h3 className={`text-3xl font-bold font-heading ${card.textColor}`}>{card.value}</h3>
            <p className="text-xs text-slate-500 mt-1">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
