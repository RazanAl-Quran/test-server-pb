"use strict";

const express = require("express");
require('dotenv').config();
const cors = require('cors');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("this is home page!!! :D :D :D");
});

app.get("/data", (req, res) => {
  res.json({
    id: 1,
    name: "Test Student",
    email: "test@test.com",
  });
});

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
