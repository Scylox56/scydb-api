const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // equals 15 minutes or like 900k ms
    max: 100, // limit each ip to 100 req per window
    message: 'Too many requests from this IP, please try again later.', 
});

module.exports = limiter;