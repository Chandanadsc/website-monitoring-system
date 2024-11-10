const rateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

const createUserRateLimit = (limit, windowMs) => {
  return rateLimit({
    store: new MongoStore({
      uri: process.env.MONGODB_URI,
      collectionName: "ratelimits",
    }),
    windowMs,
    max: (req) => {
      // Premium users get higher limits
      return req.user?.isPremium ? limit * 2 : limit;
    },
    keyGenerator: (req) => req.userId,
  });
};

module.exports = { createUserRateLimit };
