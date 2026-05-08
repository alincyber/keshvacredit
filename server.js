const express = require("express");
const otpRoutes = require("./routes/otpRoutes.js");

const app = express();

app.use(express.json());

app.use("/api", otpRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});