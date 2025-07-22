const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');

exports.protect = catchAsync(async (req, res, next) => {
   let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in.', 401));
  }


  let decoded;
try {
  decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  return next(new AppError('Invalid token. Please log in again.', 401));
}


  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user no longer exists.', 401));
  }
  req.user = currentUser;
  next();
});


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission!', 403));
    }
    next();
  };
};
