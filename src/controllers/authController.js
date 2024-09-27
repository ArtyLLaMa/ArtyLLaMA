const authService = require('../services/authService');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await authService.registerUser(username, password);
    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const { token, user } = await authService.loginUser(username, password);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(401).json({ error: error.message });
  }
};
