// Add Express
const express = require("express");

var path = require("path");
// Initialize Express
const app = express();

// set the view engine to ejs
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
// Create GET request

app.get("/", function (req, res) {
  res.render("pages/index", { name: "Hello world" });
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
