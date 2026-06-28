const Task = require('../models/Task');

/**
 * @desc    Get all tasks for logged in user (with Search, Filter, Sort)
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  try {
    const query = { userId: req.user._id };

    // Search filter (in Title or Description)
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Exact match filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Sort parsing (e.g. sort=dueDate:asc or sort=createdAt:desc)
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (req.query.sort) {
      const parts = req.query.sort.split(':');
      const sortField = parts[0];
      const sortOrder = parts[1] === 'desc' ? -1 : 1;
      sortOptions = { [sortField]: sortOrder };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    return res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    return res.json({ success: true, task });
  } catch (error) {
    console.error('Get task by id error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide a task title' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description,
      priority,
      status,
      category,
      dueDate,
    });

    return res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  try {
    const { title, description, priority, status, category, dueDate } = req.body;

    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    // Set fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    return res.json({
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    return res.json({
      success: true,
      message: 'Task deleted successfully',
      taskId: req.params.id,
    });
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid task ID' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get dashboard statistics for the logged in user
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run aggregations or query simple metrics
    const tasks = await Task.find({ userId });
    
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      highPriority: tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length,
      mediumPriority: tasks.filter(t => t.priority === 'medium' && t.status !== 'completed').length,
      lowPriority: tasks.filter(t => t.priority === 'low' && t.status !== 'completed').length,
      dueSoon: 0, // due today or tomorrow
      overdue: 0
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'completed') {
        const taskDueDate = new Date(task.dueDate);
        taskDueDate.setHours(0,0,0,0);
        
        if (taskDueDate < today) {
          stats.overdue += 1;
        } else {
          // Less than or equal to 2 days from now is considered "due soon"
          const twoDaysFromNow = new Date(today);
          twoDaysFromNow.setDate(today.getDate() + 2);
          if (taskDueDate <= twoDaysFromNow) {
            stats.dueSoon += 1;
          }
        }
      }
    });

    return res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
