const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

router.get("/", (req, res) => {
  docClient.scan({ TableName: "users", Limit: 10 }, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  });
});
module.exports = router;
