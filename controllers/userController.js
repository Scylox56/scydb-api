const User = require('../models/User');
const Role = require('../models/Role');
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

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo', 'role');
  
  // Check if trying to update role
  if (req.body.role && req.user.role !== 'super-admin') {
    return next(new AppError('Only super-admins can modify roles', 403));
  }

  // Validate role exists if being updated
  if (req.body.role) {
    const roleExists = await Role.findOne({ name: req.body.role.toLowerCase() });
    if (!roleExists) {
      return next(new AppError('Invalid role specified', 400));
    }
    filteredBody.role = req.body.role.toLowerCase();
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    { new: true, runValidators: true }
  ).select('-__v -password');

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'super-admin') {
    return next(new AppError('Only super-admins can delete users', 403));
  }

  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

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

// New method to get user statistics
exports.getUserStats = catchAsync(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] }
        }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ active: true });

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      summary: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers
      }
    }
  });
});

// Method to get available roles for dropdown
exports.getAvailableRoles = catchAsync(async (req, res, next) => {
  const roles = await Role.find({ isActive: { $ne: false } })
    .select('name description -_id')
    .sort('name');

  res.status(200).json({
    status: 'success',
    results: roles.length,
    data: { roles }
  });
});