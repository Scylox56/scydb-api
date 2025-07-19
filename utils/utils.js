const jwt = require('jsonwebtoken');

// JWT Token Generator
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});

// Async Error Handler
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Secure Field Filter
const filterObj = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((field) => {
    if (allowedFields.includes(field)) filteredObj[field] = obj[field];
  });
  return filteredObj;
};

module.exports = { signToken, catchAsync, filterObj };