const Redis = require("ioredis");
let redisClient = new Redis(
  "redis://default:a1e07c7df6b2437b9005d2a631d72b7d@eu2-driving-swine-30169.upstash.io:30169"
);

module.exports = redisClient;
