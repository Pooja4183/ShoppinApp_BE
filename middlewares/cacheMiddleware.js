const redisClient = require("../config/redisClient");

/**
 * ✅ Universal Redis Cache Middleware
 * --------------------------------------------------------
 * @param {string} prefix - Unique cache prefix (e.g., 'category', 'product')
 * @param {number} ttl - Time to live in seconds (default = 3600 = 1 hour)
 * --------------------------------------------------------
 * Features:
 *  - Generic, reusable cache layer for any GET route
 *  - Prevents redundant MongoDB queries
 *  - Gracefully skips cache if Redis is unavailable
 *  - Automatically expires data after TTL
 * --------------------------------------------------------
 */

const cachemiddleWare = (prefix, ttl = 3600) => {
    return async (req, res, next) => {
        try {
            //1. Build a unique cache key for this route
            // Using orignal url includes params + query automatically

            const key = `${prefix}:${req.originalUrl}`;

            // 2. check Redis for cached response
            const cacheData = await redisClient.get(key);

            if (cacheData) {
                console.log(`Cache hit :[${key}]`);
                return res.status(200).json({
                    success: true,
                    source: "cache",
                    data: JSON.parse(cacheData),
                });
            }

            //3. Override res.json to capture the response before sending it
            const originalJson = res.json.bind(res);

            res.json = async (body) => {
                try {
                    // Only cache if response has data
                    if (body?.data) {
                        await redisClient.setEx(key, ttl, JSON.stringify(body.data));
                        console.log(`cached response [${key}]for ${ttl}s`);
                    }
                } catch (err) {
                    console.log("Redis cache set error:", err.message);
                }
                // send actual response
                originalJson(body);
            };

            // continue to the next middleware or controller
            next();
        } catch (error) {
            console.log("cache middleware error", error.message);
            next(); // Proceed if even redis fails
        }
    };
};
module.exports = cachemiddleWare;
