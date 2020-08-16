"use strict";
const express = require("express");
const AWS = require("aws-sdk");
require("dotenv").config();
const app = express();
const users = require("./routes/users");
const auth = require("./routes/auth");

// Routes
app.use(express.json());
app.use("/users", users);
app.use(auth);
app.get("/", (req, res) => {
  res.send("hello");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

module.exports = app;
