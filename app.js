"use strict";

const express = require("express");
const AWS = require("aws-sdk");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const app = express();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const docClient = new AWS.DynamoDB.DocumentClient();
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/users", (req, res) => {
  docClient.scan({ TableName: "users" }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
app.post("/register", (req, res) => {
  const { name, password, email } = req.body;
  let hash = bcrypt.hashSync(password, 10);
  let id = uuid.v1();
  docClient.put(
    {
      TableName: "users",
      Item: {
        userId: id,
        name,
        password: hash,
        email
      }
    },
    function(err, data) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.status(201).send("Successfully");
      }
    }
  );
});
app.post("/login", (req, res) => {
  const { password, email } = req.body;

  docClient.get(
    {
      TableName: "users",
      Key: {
        email: email
      },
      AttributesToGet: ["email", "password"]
    },
    function(err, data) {
      if (err) {
        res.status(401).send(err);
      } else {
        let compare = bcrypt.compareSync(password, data.Item.password);
        let token = jwt.sign(data.Item, secret);
        compare ? res.send(token) : res.send("Wrong password");
      }
    }
  );
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Serverless Error");
});

module.exports = app;
