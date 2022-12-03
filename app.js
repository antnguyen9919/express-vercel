// Add Express
const express = require("express");
const jwt = require("jsonwebtoken");
var path = require("path");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcryptjs");
var admin = require("firebase-admin");
const { getApps } = require("firebase-admin/app");
const serviceAccount = require(path.join(__dirname, "./service.json"));
const bodyParser = require("body-parser");
const chalk = require("chalk");

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Initialize Express
const app = express();

// set the view engine to ejs
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
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
app.use(express.static(path.resolve(__dirname, "dist")));
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
      console.log(chalk.red(error.message));
      next();
    }
  } else {
    next();
  }
}

app.get("/", auth_required, function (req, res) {
  const user = req.user;
  if (user) {
    return res.redirect("/management/tasks");
  }
  res.render("pages/home", { user: req.user });
});

app.get("/users/login", auth_required, function (req, res) {
  const user = req.user;
  if (user) return res.redirect("/management/tasks");
  res.render("pages/login");
});
app.get("/users/register", auth_required, function (req, res) {
  const user = req.user;
  if (user) return res.redirect("/management/tasks");
  res.render("pages/register");
});
app.get("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.redirect("/");
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
      const stored_user_array = await admin
        .firestore()
        .collection("users")
        .where("email", "==", email)
        .get();
      if (stored_user_array.empty) {
        errors.push({ msg: "Account doesn't exist" });
        return res.render("pages/login", {
          errors,

          email,
          password,
        });
      }
      let stored_user;
      stored_user_array.forEach((doc) => {
        let uid = doc.id;
        let udata = doc.data();
        stored_user = { uid, ...udata };
      });

      const matched = await bcrypt.compare(
        password,
        stored_user.hashed_password
      );
      if (!matched) {
        errors.push({ msg: "Invalid password" });
        return res.render("pages/login", {
          errors,

          email,
          password,
        });
      }
      const lastLogin = new Date();
      await admin.firestore().collection("users").doc(stored_user.uid).update({
        lastLogin,
      });
      const final_user = {
        uid: stored_user.uid,
        email: stored_user.email,
        name: stored_user.name,
        date_created: stored_user.date_created,
        lastLogin,
      };
      const token = jwt.sign({ user: final_user }, jwt_secret, {
        expiresIn: "1h",
      });
      res.cookie("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.redirect("/management/tasks");
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
      const check_existed = await admin
        .firestore()
        .collection("users")
        .where("email", "==", email)
        .get();

      if (!check_existed.empty) {
        errors.push({ msg: "Email already exists" });
        return res.render("pages/register", {
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
          date_created: new Date(),
        };
        await admin.firestore().collection("users").add(new_user);
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
});
app.get("/management/dashboard", auth_required, function (req, res) {
  const user = req.user;
  if (!user) return res.redirect("/users/login");

  res.render("pages/dashboard", { user });
});
app.get("/management/tasks", auth_required, function (req, res) {
  const user = req.user;
  if (!user) return res.redirect("/users/login");

  res.render("pages/tasks-management", { user });
});
app.get("/management/study", auth_required, function (req, res) {
  const user = req.user;
  if (!user) return res.redirect("/users/login");

  res.render("pages/study", { user });
});
app.get("/management/budget", auth_required, function (req, res) {
  const user = req.user;
  if (!user) return res.redirect("/users/login");

  res.render("pages/budget", { user });
});

app.get("/profile", auth_required, (req, res) => {
  const user = req.user;
  if (!user) return res.redirect("/users/login");
  res.render("pages/profile", { user });
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
app.post("/api/addTask", auth_required, async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "unauthorized" });
  const task = req.body["new-task-input"];
  const final_object = {
    date_created: new Date(),
    task,
    user_id: user.uid,
    finished: false,
  };

  try {
    await admin
      .firestore()
      .collection("tasks")
      .add({ ...final_object });
    return res.redirect("/management/tasks");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/api/tasks", auth_required, async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "unauthorized" });
  let tasks = [];
  try {
    const tasks_firebase = await admin
      .firestore()
      .collection("tasks")

      .where("user_id", "==", user.uid)

      .get();

    if (tasks_firebase.empty) {
      return res.json({ tasks });
    }
    tasks_firebase.forEach((doc) => {
      task_id = doc.id;
      task_data = doc.data();

      tasks.push({ task_id, ...task_data });
    });
    const sorted_tasks = tasks.sort((a, b) => {
      return b.date_created - a.date_created;
    });
    return res.json({ tasks: sorted_tasks });
  } catch (error) {
    return res.json({ error: error.message });
  }
});
app.post("/api/completeTask", auth_required, async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "unauthorized" });
  const { task_id } = req.body;
  if (!task_id) return res.status(401).json({ error: "id missing " });
  try {
    await admin
      .firestore()
      .collection("tasks")
      .doc(task_id)
      .update({ finished: true, complete_date: new Date() });
    return res.status(200).json({ status: "successful" });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// Initialize server
app.listen(5000, () => {
  console.log(chalk.blue("Running on port 5000."));
});
// Export the Express API
module.exports = app;
