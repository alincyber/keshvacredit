const mongoose = require("mongoose");
const dns = require("dns");
const logger = require("./logger");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    logger.info("DB Connected");
  } catch (error) {
    logger.error({ err: error }, "DB Error");
  }
};

module.exports = connectDB;
