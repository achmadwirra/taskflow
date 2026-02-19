const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/me", auth, userController.getMe);
router.patch("/me", auth, userController.updateMyProfile);

module.exports = router;
