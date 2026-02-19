const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const adminService = require("../services/adminService");

exports.getSummary = asyncHandler(async (req, res) => {
    const data = await adminService.getSummary();
    success(res, data, "Admin summary");
});

exports.getProjectsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Query param 'userId' is required",
        });
    }

    const data = await adminService.getProjectsByUser(userId);
    success(res, data, "Projects by user");
});

exports.getAllUsers = asyncHandler(async (req, res) => {
    const data = await adminService.getAllUsers();
    success(res, data, "All users");
});

exports.impersonate = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const adminId = req.user.id;

    const data = await adminService.impersonateUser(userId, adminId);
    success(res, data, "Impersonation token generated");
});

exports.getTimeline = asyncHandler(async (req, res) => {
    const data = await adminService.getTimeline();
    success(res, data, "Activity timeline");
});

exports.getAllProjects = asyncHandler(async (req, res) => {
    const includeDeleted = req.query.includeDeleted === "true";
    const data = await adminService.getAllProjects(includeDeleted);
    success(res, data, "All projects");
});

exports.updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const adminId = req.user.id;
    const { adminUpdateUserSchema } = require("../validations/userValidation");
    const parsed = adminUpdateUserSchema.parse(req.body);

    const userService = require("../services/userService");
    const data = await userService.adminUpdateUser(userId, adminId, parsed);
    success(res, data, "User updated");
});
