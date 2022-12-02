// Add Express
const express = require("express");

// Initialize Express
const app = express();

// set the view engine to ejs
app.set("view engine", "ejs");
// Create GET request

app.get("/", function (req, res) {
  res.render("pages/index", { name: "Hello world" });
});
// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});
// Export the Express API
module.exports = app;
