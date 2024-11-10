const rateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

const limiterConfig = {
  store: new MongoStore({
    uri: process.env.MONGODB_URI,
    collectionName: "rate-limits",
    expireTimeMs: 60 * 60 * 1000,
  }),
};

exports.apiLimiter = rateLimit({
  ...limiterConfig,
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: { message: "Too many requests, please try again later" },
});

exports.authLimiter = rateLimit({
  ...limiterConfig,
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many authentication attempts, please try again later",
  },
});

exports.monitoringLimiter = rateLimit({
  ...limiterConfig,
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: { message: "Too many monitoring requests, please try again later" },
});
