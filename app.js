const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
const limiter = require('./middlewares/rateLimiter');

const app = express();

// the middlwares
app.use(cors({
   origin: process.env.FRONTEND_URL || 'http://localhost:8080',
   credentials: true
}));
app.use(helmet());
app.use(hpp());
app.use(limiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/movies', require('./routes/movieRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;