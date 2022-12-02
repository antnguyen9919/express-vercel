// Add Express
const express = require("express");
const jwt = require("jsonwebtoken");
var path = require("path");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcryptjs");
// Initialize Express
const app = express();
const redisClient = require(path.join(__dirname, "./config/redis"));
// set the view engine to ejs
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const jwt_secret =
  "ca3eab105b5be6bb4b7b5ccf6be381c778ec6ee09b252c117db12d8c41b6a53a";
// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.static("dist"));
// Connect flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

function auth_required(req, res, next) {
  //   const token = req.cookies.auth_token;
  const token = req.cookies["auth_token"];
  if (token) {
    try {
      const { user } = jwt.verify(token, jwt_secret);
      if (user) req.user = user;
      next();
    } catch (error) {
      console.log(error.message);
      next();
    }
  } else {
    next();
  }
}

app.get("/", auth_required, function (req, res) {
  res.render("pages/home", { user: req.user });
});

app.get("/users/login", auth_required, function (req, res) {
  const user = req.user;
  if (user) return res.redirect("/");
  res.render("pages/login");
});
app.get("/users/register", auth_required, function (req, res) {
  const user = req.user;
  if (user) return res.redirect("/");
  res.render("pages/register");
});
app.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.redirect("/users/login");
});
app.post("/users/login", async function (req, res) {
  const { email, password } = req.body;
  let errors = [];

  if (!email || !password) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("pages/login", {
      errors,

      email,
      password,
    });
  } else {
    try {
      const user_id = await redisClient.hget("users", email);
      if (!user_id) {
        errors.push({ msg: "Account doesn't exist" });
        return res.render("pages/login", {
          errors,

          email,
          password,
        });
      }
      const stored_password = await redisClient.hget(
        "user:" + user_id,
        "hashed_password"
      );

      if (!stored_password) {
        errors.push({ msg: "Password not found" });
        return res.render("pages/login", {
          errors,

          email,
          password,
        });
      }

      const matched = await bcrypt.compare(password, stored_password);
      if (!matched) {
        errors.push({ msg: "Invalid password" });
        return res.render("pages/login", {
          errors,

          email,
          password,
        });
      }

      const returned_user = await redisClient.hgetall("user:" + user_id);
      const final_user = {
        uid: user_id,
        email: returned_user.email,
        name: returned_user.name,
        date: returned_user.date,
      };
      const token = jwt.sign({ user: final_user }, jwt_secret, {
        expiresIn: "1h",
      });
      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.redirect("/profile");
    } catch (error) {
      errors.push({ msg: error.message });
      return res.render("pages/login", {
        errors,

        email,
        password,
      });
    }
  }
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
          name,
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

app.get("/profile", auth_required, (req, res) => {
  const user = req.user;
  if (!user) return res.redirect("/users/login");
  res.render("pages/dashboard", { user });
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
