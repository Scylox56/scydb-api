const rateLimit = require('express-rate-limit');

// More permissive limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes for auth routes
    message: 'Too many login attempts, please try again later.',
});

// Standard limiter for other routes
const standardLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per 15 minutes
    message: 'Too many requests from this IP, please try again later.',
});

module.exports = {
    authLimiter,
    standardLimiter
};