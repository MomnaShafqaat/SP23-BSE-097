const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const User = require("../../models/user.model");

let router = express.Router();

router.use(cookieParser());

// Session middleware setup (required for flash messages)
router.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set `secure: true` only for HTTPS
  })
);

router.use(flash());

// Register page (GET)
router.get("/register", (req, res) => {
  res.render("partials/register", {
    layout: "formLayout",
    stylesheet: ["/css/register"],
    messages: req.flash("error"), // Passing flash messages as `messages`
  });
});


// Register logic (POST)
router.post("/register", async (req, res) => {
  try {
    let data = req.body;
    let newUser = new User(data);

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    // Set a flash message and redirect
    req.flash("success", "Registration successful");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/register");
  }
});

// Login page (GET)
router.get("/login", (req, res) => {
  res.render("partials/login", {
    layout: "formLayout",
    stylesheet: ["/css/register"], // Example stylesheet
    successMessage: req.flash("success"), // Display success messages
    errorMessage: req.flash("error"), // Display error messages
  });
});

// Login logic (POST)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/login");
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      req.flash("error", "Wrong password.");
      return res.redirect("/login");
    }

    // On successful login, set session or token
    req.session.user = user; // Store user info in the session
    req.flash("success", "Login successful.");
    user=user
    res.redirect("/");
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error. Please try again later.");
    res.redirect("/login");
  }
});
// In your route for the home page or the relevant page


// Logout logic
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout failed:", err);
      return res.status(500).send("Failed to log out.");
    }

    // Clear session cookie
    res.clearCookie("connect.sid"); // Default cookie name for sessions
    req.flash("success", "Logged out successfully.");
    res.redirect("/admin/homepage");
  });
});



module.exports = router;
