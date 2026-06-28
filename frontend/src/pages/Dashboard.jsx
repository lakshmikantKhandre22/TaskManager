import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import StatsCards from '../components/StatsCards';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import { FiSearch, FiSliders, FiPlus, FiFolder, FiTrash2, FiInbox, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = ({ onCreateTaskTrigger, isCreateOpen, setIsCreateOpen }) => {
  const {
    tasks,
    stats,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    deleteTask,
  } = useTasks();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Others'];

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result && result.success) {
        toast.success('Task deleted successfully');
      } else {
        toast.error(result?.error || 'Failed to delete task');
      }
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setSortBy('createdAt:desc');
  };

  const hasActiveFilters = search || statusFilter || priorityFilter || categoryFilter;

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      <StatsCards stats={stats} />

      {/* Control Actions / Filter Bars */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full lg:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <FiSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors text-sm"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm focus:outline-none focus:border-indigo-600 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm focus:outline-none focus:border-indigo-600 bg-white"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm focus:outline-none focus:border-indigo-600 bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Criteria */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-650 text-sm focus:outline-none focus:border-indigo-600 bg-white"
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="dueDate:asc">Due Date (Asc)</option>
              <option value="dueDate:desc">Due Date (Desc)</option>
              <option value="priority:desc">Priority (High to Low)</option>
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
              >
                <FiRefreshCw className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-soft animate-pulse space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="w-5 h-5 rounded-full bg-slate-200" />
                <div className="flex-1 h-4 bg-slate-200 rounded" />
                <div className="w-16 h-5 bg-slate-200 rounded-full" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3.5 bg-slate-200 rounded w-full" />
                <div className="h-3.5 bg-slate-200 rounded w-3/4" />
              </div>
              <div className="h-px bg-slate-100 mt-4" />
              <div className="flex items-center justify-between pt-2">
                <div className="w-24 h-4 bg-slate-200 rounded" />
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                  <div className="w-7 h-7 bg-slate-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center max-w-md mx-auto shadow-soft flex flex-col items-center">
          <div className="p-4 bg-slate-50 rounded-full border border-slate-100 mb-4 text-slate-400">
            <FiInbox className="w-12 h-12" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-slate-800">
            {hasActiveFilters ? 'No Matching Tasks' : 'Start tracking tasks'}
          </h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            {hasActiveFilters
              ? "We couldn't find any tasks matching your filters. Try adjusting your parameters or clear active filters."
              : 'Keep your workflows clean. Create your first task to start organizing and optimizing your productivity.'}
          </p>
          {!hasActiveFilters ? (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-6 flex items-center bg-indigo-650 text-white font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-755 transition-colors shadow-premium gap-2 cursor-pointer"
            >
              <FiPlus className="w-4 h-4" />
              Create Task
            </button>
          ) : (
            <button
              onClick={handleResetFilters}
              className="mt-6 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
