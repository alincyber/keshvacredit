const express = require("express");
const otpRoutes = require("./routes/otpRoutes.js");
const cors = require("./middleware/cors.js");
const dotenv = require("dotenv");
dotenv.config()
const app = express();

app.use(express.json());

app.use("/api", otpRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});