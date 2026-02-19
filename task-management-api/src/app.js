require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Task Management API Running" });
});

// REGISTER ROUTES DULU
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/", taskRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

// ERROR HANDLER PALING BAWAH
app.use(errorMiddleware);

// BARU LISTEN
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
