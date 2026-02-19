const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/response");
const userService = require("../services/userService");
const { updateProfileSchema } = require("../validations/userValidation");

exports.getMe = asyncHandler(async (req, res) => {
    const data = await userService.getMe(req.user.id);
    success(res, data, "Profile retrieved");
});

exports.updateMyProfile = asyncHandler(async (req, res) => {
    const parsed = updateProfileSchema.parse(req.body);
    const data = await userService.updateProfile(req.user.id, parsed);
    success(res, data, "Profile updated");
});
