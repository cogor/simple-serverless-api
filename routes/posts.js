const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

router.get("/posts", (req, res) => {
  docClient.scan({ TableName: "posts", Limit: 24 }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
router.post("/posts", (req, res) => {
  let user = jwt.verify(req.headers.authorization.split(" ")[1], secret);
  const { name, components } = req.body;
  if (user) {
    docClient.put(
      {
        TableName: "posts",
        Item: {
          id: uuid.v1(),
          name,
          components
        }
      },
      function(err, data) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.status(201).send(data);
        }
      }
    );
  }
});
module.exports = router;
