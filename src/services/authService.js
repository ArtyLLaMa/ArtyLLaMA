const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.registerUser = async (username, password) => {
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already taken');
    }

    // Create a new user
    const newUser = await User.create({ username, password });

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return { token, user: { id: newUser.id, username: newUser.username } };
  } catch (error) {
    throw error;
  }
};

exports.loginUser = async (username, password) => {
  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return { token, user: { id: user.id, username: user.username } };
  } catch (error) {
    throw error;
  }
};
