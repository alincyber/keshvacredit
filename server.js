const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const dns = require ("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const app = express();

app.use(cors());
app.use(express.json());
const otpRoutes = require ("./routes/otpRoutes");
const loginroutes = require("./routes/loginroutes");

app.use("/api", loginroutes);
app.use("/api",otpRoutes)
// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

// Server Start
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});