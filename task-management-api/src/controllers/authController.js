const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const taskService = require("../services/taskService");
const { registerSchema } = require("../validations/authValidation");

const db = require("../config/prisma");

// const parsed = registerSchema.parse(req.body);

exports.register = asyncHandler(async (req, res) => {
    // VALIDATION HARUS DI DALAM FUNCTION
    const parsed = registerSchema.parse(req.body);

    const { name, email, password } = parsed;

    const hashed = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
    });

    success(res, user, "User registered", 201);
});


exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await db.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    success(res, { token }, "Login success");

};

