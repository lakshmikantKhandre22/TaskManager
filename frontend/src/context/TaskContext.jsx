import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0,
    mediumPriority: 0,
    lowPriority: 0,
    dueSoon: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(false);
  
  // Filtering & Sorting State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt:desc'); // Default: Newest first

  // Fetch Tasks with filters
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      // Construct query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (categoryFilter) params.append('category', categoryFilter);
      if (sortBy) params.append('sort', sortBy);

      const res = await api.get(`/tasks?${params.toString()}`);
      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/tasks/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Error fetching task stats:', err);
    }
  }, [isAuthenticated]);

  // Trigger data load when filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
      fetchStats();
    } else {
      setTasks([]);
      setStats({
        total: 0,
        todo: 0,
        inProgress: 0,
        completed: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        dueSoon: 0,
        overdue: 0,
      });
    }
  }, [isAuthenticated, fetchTasks, fetchStats]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      if (res.data.success) {
        // Refetch tasks and stats
        fetchTasks();
        fetchStats();
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      console.error('Error creating task:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to create task' };
    }
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      if (res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true, task: res.data.task };
      }
    } catch (err) {
      console.error('Error updating task:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to update task' };
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await api.delete(`/tasks/${id}`);
      if (res.data.success) {
        fetchTasks();
        fetchStats();
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      return { success: false, error: err.response?.data?.message || 'Failed to delete task' };
    }
  };

  // Toggle Complete Status
  const toggleComplete = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    return await updateTask(id, { status: newStatus });
  };

  return (
    <TaskContext.Provider
      value={{
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
        fetchTasks,
        fetchStats,
        createTask,
        updateTask,
        deleteTask,
        toggleComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
