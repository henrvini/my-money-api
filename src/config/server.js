const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const express = require("express");
const server = express();
const allowCors = require("./cors");
const queryParser = require("express-query-int");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(allowCors);
server.use(queryParser());

server.listen(port, () => {
  console.log(`API Running on ${port}`);
});

module.exports = server;
