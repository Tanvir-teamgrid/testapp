require("dotenv").config();
const connection = require('./config/database');
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

 
const jobRoute = require("./routes/job-route");
const userRoute = require("./routes/user-route");
 
 
const PORT = process.env.PORT || 8080;
const app = express();
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("my-upload"));

app.use("/job",jobRoute);
app.use("/user",userRoute);
 
app.listen(PORT, () => {
  console.log(`server has started at port ${PORT}`);
});
