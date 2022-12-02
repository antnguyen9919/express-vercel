// Add Express
const express = require("express");
const Redis = require("ioredis");
var path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
// Initialize Express
const app = express();

// set the view engine to ejs
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());
let client = new Redis(
  "redis://default:a1e07c7df6b2437b9005d2a631d72b7d@eu2-driving-swine-30169.upstash.io:30169"
);

app.get("/", function (req, res) {
  res.render("pages/home", { name: "Hello world" });
});

app.get("/users/login", function (req, res) {
  res.render("pages/login");
});
app.get("/users/register", function (req, res) {
  res.render("pages/register");
});
app.post("/users/register", function (req, res) {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    console.log("OK");
  }
  //   res.render("pages/register");
});

app.get("/dashboard", (req, res) => {
  res.render("pages/dashboard", { user: { name: "An" } });
});

app.get("/api/users", function (req, res) {
  res.json({
    users: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
      { id: 3, name: "Mary Doe" },
      { id: 4, name: "Peter Doe" },
      { id: 5, name: "Mike Doe" },
      { id: 6, name: "Jack Doe" },
    ],
  });
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});
// Export the Express API
module.exports = app;
