const { z } = require("zod");

exports.updateProfileSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
}).strict();

exports.adminUpdateUserSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
}).strict();
