const logger = require("../config/logger");

const SENSITIVE_KEYS = new Set([
  "authorization",
  "cookie",
  "password",
  "token",
  "otp",
  "pan",
  "phone"
]);

const sanitize = (value) => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      SENSITIVE_KEYS.has(key.toLowerCase()) ? "[REDACTED]" : sanitize(item)
    ])
  );
};

const getLogLevel = (statusCode) => {
  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "warn";
  return "info";
};

const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  const originalJson = res.json;
  const originalSend = res.send;

  res.json = function jsonWithLogging(body) {
    res.locals.responseBody = sanitize(body);
    return originalJson.call(this, body);
  };

  res.send = function sendWithLogging(body) {
    if (res.locals.responseBody === undefined) {
      try {
        res.locals.responseBody = typeof body === "string" ? JSON.parse(body) : sanitize(body);
      } catch (error) {
        res.locals.responseBody = typeof body === "string" ? body.slice(0, 500) : "[unserializable response]";
      }
    }

    return originalSend.call(this, body);
  };

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1000000;
    const level = getLogLevel(res.statusCode);

    logger[level](
      {
        req: {
          method: req.method,
          url: req.originalUrl || req.url,
          query: sanitize(req.query),
          params: sanitize(req.params),
          ip: req.ip,
          userAgent: req.get("user-agent")
        },
        res: {
          statusCode: res.statusCode
        },
        requestBody: sanitize(req.body),
        responseBody: res.locals.responseBody,
        responseTime: `${durationMs.toFixed(2)} ms`
      },
      `${req.method} ${req.originalUrl || req.url} completed with ${res.statusCode}`
    );
  });

  next();
};

module.exports = requestLogger;
