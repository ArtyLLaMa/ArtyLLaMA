const jwt = require("jsonwebtoken");

// Hardcoded user for demonstration purposes
const dummyUser = {
  id: "user0",
  username: "user",
  password: "", // Passwords will be hashed once the whole system is implemented
};

/**
 * User login controller (a simple version to demonstrate JWT authentication)
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (username === dummyUser.username && password === dummyUser.password) {
    const token = jwt.sign({ id: dummyUser.id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Token expires in 24 hours for debugging purposes
    });

    res.status(200).json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};
