const user = require("./routes/user");
const task = require("./routes/tasks");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());
app.use(cors());
const db = process.env.MONGOURL;
console.log(db);
mongoose.connect(db)
  .then(() => {
    console.log("Connected to MongoDB");
  });


app.use("/api/user", user);
app.use("/api/task", task);
app.listen(4000, () => {
  console.log("Server started at port 4000");
});
