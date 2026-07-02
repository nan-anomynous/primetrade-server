const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const authorize = require("./middleware/roleMiddleware");
const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middleware/errorMiddleware");


app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://primetrade-client-7r7l-coral.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // limit each IP to 100 requests
  message: "Too many requests, try again later",
});

app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is running..."
  });
});

app.get("/api/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route",
    user: req.user,
  });
});

app.get(
  "/api/admin",
  protect,
  authorize("admin"),
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "Welcome Admin",
      user: req.user
    });
  }
);


app.use(errorHandler);

module.exports = app;