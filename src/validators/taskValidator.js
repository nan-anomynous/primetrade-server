const { body } = require("express-validator");

const taskValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Invalid status value"),
];

module.exports = { taskValidator };