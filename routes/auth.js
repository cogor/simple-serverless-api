const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

router.post("/register", (req, res) => {
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
router.post("/login", (req, res) => {
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

module.exports = router;
