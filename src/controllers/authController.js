const {
  registerService,
  loginService,
} = require("../sevices/authService");

const { success, error } = require("../utils/apiResponse");

const registerUser = async (req, res) => {
  try {
    const user = await registerService(req.body);

    return success(res, 201, "User registered successfully", user);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginService(email, password);

    return success(res, 200, "Login successful", data);
  } catch (err) {
    return error(res, 400, err.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
};