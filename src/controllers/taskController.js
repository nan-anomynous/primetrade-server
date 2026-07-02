const Task = require("../models/Task");
const { success, error } = require("../utils/apiResponse");

/* CREATE TASK */
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      user: req.user.id,
    });

    return success(res, 201, "Task created", task);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

/* GET TASKS */
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("user", "name email");
    } else {
      tasks = await Task.find({ user: req.user.id });
    }

    return success(res, 200, "Tasks fetched", tasks);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

/* GET BY ID */
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return error(res, 404, "Task not found");

    if (
      req.user.role !== "admin" &&
      task.user.toString() !== req.user.id
    ) {
      return error(res, 403, "Not authorized");
    }

    return success(res, 200, "Task fetched", task);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

/* UPDATE */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return error(res, 404, "Task not found");

    if (
      req.user.role !== "admin" &&
      task.user.toString() !== req.user.id
    ) {
      return error(res, 403, "Not authorized");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return success(res, 200, "Task updated", updatedTask);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

/* DELETE */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return error(res, 404, "Task not found");

    if (
      req.user.role !== "admin" &&
      task.user.toString() !== req.user.id
    ) {
      return error(res, 403, "Not authorized");
    }

    await task.deleteOne();

    return success(res, 200, "Task deleted");
  } catch (err) {
    return error(res, 400, err.message);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};