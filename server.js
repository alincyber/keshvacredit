const express = require("express");
const cors = require("cors");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const PORT = process.env.PORT || 5000;

const otpRoutes = require("./routes/otpRoutes");
const loginroutes = require("./routes/loginroutes");
const connectDB = require("./config/db");

app.use(cors());
app.use(express.json());

// CONNECT DATABASE
connectDB();

// Routes
app.use("/api", loginroutes);
app.use("/api", otpRoutes);

app.get("/read", (req, res) => {
  res.json({
    message: "hi"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});