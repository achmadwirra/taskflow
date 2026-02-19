const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

exports.generateImpersonationToken = (targetUser, adminId) => {
    return jwt.sign(
        {
            id: targetUser.id,
            role: targetUser.role,
            isImpersonation: true,
            impersonatedBy: adminId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

