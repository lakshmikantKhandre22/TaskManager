import React from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { FiCalendar, FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiCircle, FiFlag } from 'react-icons/fi';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

const TaskCard = ({ task, onEditClick, onDeleteClick }) => {
  const { toggleComplete } = useTasks();

  const handleToggleComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleComplete(task._id, task.status);
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getDueDateStatus = (dueDate, status) => {
    if (!dueDate || status === 'completed') return { text: '', style: 'text-slate-400' };

    const date = new Date(dueDate);
    const formatted = format(date, 'MMM dd, yyyy');

    if (isPast(date) && !isToday(date)) {
      return { text: `Overdue (${formatted})`, style: 'text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100' };
    }
    if (isToday(date)) {
      return { text: 'Due Today', style: 'text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100' };
    }
    if (isTomorrow(date)) {
      return { text: 'Due Tomorrow', style: 'text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg' };
    }

    return { text: formatted, style: 'text-slate-500' };
  };

  const { text: dueDateText, style: dueDateStyle } = getDueDateStatus(task.dueDate, task.status);

  return (
    <div
      className={`bg-white border rounded-2xl p-5 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${
        task.status === 'completed' ? 'border-green-100 bg-green-50/5' : 'border-slate-200'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <button
            onClick={handleToggleComplete}
            className={`mt-1 flex-shrink-0 transition-colors duration-200 cursor-pointer ${
              task.status === 'completed' ? 'text-green-600' : 'text-slate-400 hover:text-indigo-600'
            }`}
          >
            {task.status === 'completed' ? (
              <FiCheckCircle className="w-5 h-5 fill-green-50" />
            ) : (
              <FiCircle className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <h4
              className={`font-heading font-semibold text-base tracking-tight text-slate-800 truncate ${
                task.status === 'completed' ? 'line-through text-slate-400' : ''
              }`}
            >
              {task.title}
            </h4>
            <p className="text-xs font-semibold text-indigo-600 mt-0.5 tracking-wide uppercase">{task.category}</p>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 capitalize ${getPriorityStyles(
              task.priority
            )}`}
          >
            <FiFlag className="w-3 h-3" />
            {task.priority}
          </span>
        </div>

        <p
          className={`text-sm text-slate-500 mt-3 line-clamp-2 h-10 ${
            task.status === 'completed' ? 'text-slate-400' : ''
          }`}
        >
          {task.description || <span className="italic text-slate-300">No description provided</span>}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          {task.dueDate && (
            <>
              <FiCalendar className="w-3.5 h-3.5 text-slate-400" />
              <span className={dueDateStyle}>{dueDateText}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            to={`/task/${task._id}`}
            title="View Details"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <FiEye className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onEditClick(task)}
            title="Edit Task"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDeleteClick(task._id)}
            title="Delete Task"
            className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-650 transition-colors cursor-pointer"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
