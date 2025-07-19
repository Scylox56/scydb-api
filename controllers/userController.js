const User = require('../models/User');
const AppError = require('../utils/appError');
const { catchAsync, filterObj } = require('../utils/utils');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v -password');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-__v -password');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
  
  if (req.body.role && req.user.role !== 'super-admin') {
    return next(new AppError('Only super-admins can modify roles', 403));
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  ).select('-__v -password');

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'super-admin') {
    return next(new AppError('Only super-admins can delete users', 403));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addToWatchlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { watchLater: req.params.movieId } },
    { new: true }
  ).select('-__v -password');

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.removeFromWatchlist = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { watchLater: req.params.movieId } },
    { new: true }
  ).select('-__v -password');

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});