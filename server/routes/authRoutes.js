const { Router } = require("express");
const router = Router();
const User = require("../models/mongoose_models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { userValidationSchema } = require("../utils/validationSchema");

// Importijng UUID library to generate the exact same taskId's for both tasks and favoriteTasks, because the database was generating different IDs for the same tasks that were favorites as well.
const { v4: uuidv4 } = require("uuid");

// User Registration
router.post("/register", userValidationSchema, async (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.logIn(user, (err) => {
      if (err) return next(err);

      const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "24h" }
      );

      res.json({ accessToken, message: "Login successful" });
    });
  })(req, res, next);
});


// Get User
router.get("/userLogged", authenticateToken, async (req,res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" })

    res.status(200).json({ name: user.name });
  } catch (err) {
    res.status(500).json({ msg: "Server errro", error: err.message });
  }
})

// Get User Tasks
router.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ tasks: user.tasks });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Add Task
router.post("/tasks", authenticateToken, async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const newTask = { taskId: uuidv4(), title, description, date };
    user.tasks.push(newTask);
    await user.save();
    res.status(201).json({ task: newTask });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete task
router.delete("/tasks/:id/", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const updatedTasks = user.tasks.filter(
      (task) => task.taskId.toString() !== taskId
    );

    const updatedFavoriteTasks = user.favoriteTasks.filter(
      (favTask) => favTask.taskId !== taskId //comparing our generated taskIds.
    );

    if (updatedTasks.length === user.tasks.length) {
      return res.status(404).json({ msg: "Task not found" });
    } else {
      user.tasks = updatedTasks;
      user.favoriteTasks = updatedFavoriteTasks;
      await user.save();
      return res.status(200).json({ msg: "Task deleted successfully" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server Error", error: err.message });
  }
});

// Add favorite task
router.post("/favorite-tasks", authenticateToken, async (req, res) => {
  const { taskId, title, description, date } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isTaskAlreadyFavorite = user.favoriteTasks.some(
      (task) =>
        task.title === title &&
        task.description === description &&
        new Date(task.date).getTime() === new Date(date).getTime()
    );

    if (isTaskAlreadyFavorite) {
      console.log("tasks already exists");
      return res.status(400).json({ msg: "Favorite task already exists" });
    }

    const newFavoriteTask = { taskId, title, description, date }; // We use the same taskId for the favorite tasks as well.
    user.favoriteTasks.push(newFavoriteTask);
    await user.save();

    res.status(201).json({ favoriteTask: newFavoriteTask });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Get favorite tasks
router.get("/favorite-tasks", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ favoriteTasks: user.favoriteTasks });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});


// Delete favorite task
router.delete("/favorite-tasks", authenticateToken, async (req, res) => {

})


// Validate token route
router.get("/validate-token", authenticateToken, async (req, res) => {
  // Checking if the provided token is valid and it belongs to the correct user.
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json({ msg: "Token is valid", user });
  } catch (err) {
    console.error("Error validating token:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Protected route
router.get("/protected-route", authenticateToken, (req, res) => {
  res.json({ msg: "Access granted", user: req.user });
});

// JWT Authentication Middleware
async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify token
    const user = await User.findById(decoded.id); // Check if user exists in the databse

    if (!user) {
      return res.status(401).json({ msg: "User does not exist" });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err);
    return res.status(403).json({ msg: "Invalid token" });
  }
}

module.exports = router;
