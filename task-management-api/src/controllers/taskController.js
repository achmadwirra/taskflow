const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const taskService = require("../services/taskService");

exports.getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const result = await taskService.getProjectTasks(
        projectId,
        req.query
    );

    success(res, result);
});

exports.createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const task = await taskService.createTask(
        req.user.id,
        {
            ...req.body,
            projectId,
        }
    );

    success(res, task, "Task created", 201);
});

exports.updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await taskService.updateTask(
        taskId,
        req.body
    );

    success(res, task, "Task updated");
});

exports.deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await taskService.deleteTask(
        taskId,
        req.user.id
    );

    success(res, task, "Task deleted");
});
