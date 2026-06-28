import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import api from '../services/api';
import EditTaskModal from '../components/EditTaskModal';
import { FiArrowLeft, FiCalendar, FiClock, FiCheckCircle, FiCircle, FiEdit2, FiTrash2, FiFlag, FiLayers } from 'react-icons/fi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteTask, toggleComplete } = useTasks();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchTaskDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tasks/${id}`);
      if (res.data.success) {
        setTask(res.data.task);
      }
    } catch (err) {
      console.error('Error fetching task details:', err);
      toast.error('Failed to load task details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleToggleComplete = async () => {
    if (!task) return;
    const result = await toggleComplete(task._id, task.status);
    if (result && result.success) {
      toast.success(task.status === 'completed' ? 'Task marked active' : 'Task completed! Good job.');
      // Update local state
      setTask({
        ...task,
        status: task.status === 'completed' ? 'todo' : 'completed',
        completedAt: task.status === 'completed' ? null : new Date(),
      });
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(task._id);
      if (result && result.success) {
        toast.success('Task deleted successfully');
        navigate('/dashboard');
      } else {
        toast.error('Failed to delete task');
      }
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-705 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-705 border-amber-200';
      case 'low':
        return 'bg-emerald-50 text-emerald-705 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-705 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'todo':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-650 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading task details...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Task details not found.</p>
        <Link to="/dashboard" className="text-indigo-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Tasks
      </button>

      {/* Main card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-soft space-y-6">
        
        {/* Title and Controls */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-150 pb-6">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border capitalize ${getStatusBadge(task.status)}`}>
                {task.status === 'completed' ? 'Completed' : task.status === 'in_progress' ? 'In Progress' : 'To Do'}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1 capitalize ${getPriorityBadge(task.priority)}`}>
                <FiFlag className="w-3 h-3" />
                {task.priority} Priority
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold border border-indigo-100 bg-indigo-50/50 text-indigo-700 flex items-center gap-1">
                <FiLayers className="w-3 h-3" />
                {task.category}
              </span>
            </div>
            
            <h2 className={`font-heading font-bold text-2xl md:text-3xl text-slate-900 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
              {task.title}
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                task.status === 'completed'
                  ? 'border-amber-200 bg-amber-50/20 text-amber-700 hover:bg-amber-50'
                  : 'border-green-200 bg-green-50/20 text-green-700 hover:bg-green-50'
              }`}
            >
              {task.status === 'completed' ? (
                <>
                  <FiCircle className="w-4 h-4" />
                  Mark Active
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  Mark Complete
                </>
              )}
            </button>
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-2.5 border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <FiEdit2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 border border-red-200 rounded-xl text-red-650 hover:bg-red-50 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <FiTrash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Task description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
          <p className="text-slate-600 leading-relaxed text-base bg-slate-50/50 p-4 rounded-2xl border border-slate-100 min-h-[120px] whitespace-pre-wrap">
            {task.description || <span className="italic text-slate-350">No description provided</span>}
          </p>
        </div>

        {/* Timeline Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
              <FiCalendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Due Date</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">
                {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
              <FiClock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Created At</p>
              <p className="text-sm font-medium text-slate-700 mt-0.5">
                {format(new Date(task.createdAt), 'PPP p')}
              </p>
            </div>
          </div>

          {task.completedAt ? (
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Completed At</p>
                <p className="text-sm font-medium text-green-700 mt-0.5">
                  {format(new Date(task.completedAt), 'PPP p')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 rounded-xl text-slate-500">
                <FiClock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Last Updated</p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {format(new Date(task.updatedAt), 'PPP p')}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          // Refetch task details to refresh page
          fetchTaskDetails();
        }}
        task={task}
      />
    </div>
  );
};

export default TaskDetails;
