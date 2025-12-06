const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // Default Redis URL
});

// Event listeners
redisClient.on("connect", () => console.log("✅ Redis connected successfully"));
redisClient.on("ready", () => console.log("🟢 Redis is ready to use"));
redisClient.on("error", (err) => console.error("❌ Redis connection error:", err));
redisClient.on("end", () => console.log("🔴 Redis disconnected"));

// Connect to Redis (safe version)
(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

// Export client
module.exports = redisClient;
