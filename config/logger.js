const pino = require("pino");

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "requestBody.password",
      "requestBody.token",
      "requestBody.otp",
      "requestBody.pan",
      "requestBody.phone",
      "responseBody.token",
      "responseBody.otp",
      "responseBody.data.pan",
      "responseBody.data.phone",
      "responseBody.user.pan",
      "responseBody.user.phone",
      "responseBody.contact.phone"
    ],
    censor: "[REDACTED]"
  },
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname"
        }
      }
});

module.exports = logger;
