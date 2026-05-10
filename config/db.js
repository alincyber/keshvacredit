const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ DB Connected");
  } catch (error) {
    console.log("❌ DB Error:", error.message);
  }
};

module.exports = connectDB;