// Add Express
const express = require("express");

var path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcrypt");
// Initialize Express
const app = express();
const redisClient = require(path.join(__dirname, "./config/redis"));
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
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.get("/", function (req, res) {
  res.render("pages/home", { name: "Hello world" });
});

app.get("/users/login", function (req, res) {
  res.render("pages/login");
});
app.get("/users/register", function (req, res) {
  res.render("pages/register");
});
app.post("/users/register", async function (req, res) {
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
    res.render("pages/register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    try {
      const id = await redisClient.hget("users", email);
      if (id !== null) {
        errors.push({ msg: "Email already exists" });
        res.render("pages/register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const hashed_password = await bcrypt.hash(password, 10);

        const new_user = {
          hashed_password,
          email,
          date: new Date(),
        };
        const user_id = await redisClient.incr("new_user_id");
        await redisClient.hmset("user:" + user_id, new_user);
        await redisClient.hset("users", new_user.email, user_id);
        req.flash("success_msg", "User are now registered");
        res.redirect("/users/login");
      }
    } catch (error) {
      errors.push({ msg: error.message });
      res.render("pages/register", {
        errors,
        name,
        email,
        password,
        password2,
      });
    }
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
