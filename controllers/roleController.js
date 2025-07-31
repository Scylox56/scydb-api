const Role = require('../models/Role');
const User = require('../models/User');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllRoles = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Role.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const roles = await features.query.select('-__v');

  res.status(200).json({
    status: 'success',
    results: roles.length,
    data: { roles }
  });
});

exports.getRole = catchAsync(async (req, res, next) => {
  const role = await Role.findById(req.params.id).select('-__v');

  if (!role) {
    return next(new AppError('No role found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { role }
  });
});

exports.createRole = catchAsync(async (req, res, next) => {
  // Check if role already exists
  const existingRole = await Role.findOne({ name: req.body.name.toLowerCase() });
  if (existingRole) {
    return next(new AppError('Role with this name already exists', 400));
  }

  const newRole = await Role.create({
    name: req.body.name,
    description: req.body.description,
    permissions: req.body.permissions
  });

  res.status(201).json({
    status: 'success',
    data: { role: newRole }
  });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  // Check if trying to update name and it conflicts with existing role
  if (req.body.name) {
    const existingRole = await Role.findOne({ 
      name: req.body.name.toLowerCase(),
      _id: { $ne: req.params.id }
    });
    if (existingRole) {
      return next(new AppError('Role with this name already exists', 400));
    }
  }

  const role = await Role.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  if (!role) {
    return next(new AppError('No role found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { role }
  });
});

exports.deleteRole = catchAsync(async (req, res, next) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    return next(new AppError('No role found with that ID', 404));
  }

  // Check if any users have this role
  const usersWithRole = await User.countDocuments({ role: role.name });
  if (usersWithRole > 0) {
    return next(new AppError('Cannot delete role that is assigned to users', 400));
  }

  // Prevent deletion of default roles
  const protectedRoles = ['client', 'admin', 'super-admin'];
  if (protectedRoles.includes(role.name)) {
    return next(new AppError('Cannot delete default system roles', 400));
  }

  await Role.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get role statistics
exports.getRoleStats = catchAsync(async (req, res, next) => {
  const roles = await Role.find().select('-__v');
  const allUsers = await User.find().select('role');
  
  console.log('Roles in database:', roles.map(r => r.name));
  console.log('User roles in database:', allUsers.map(u => u.role));
  
  const statsPromises = roles.map(async (role) => {
    const userCount = await User.countDocuments({ role: role.name });
    console.log(`Role "${role.name}" has ${userCount} users`);
    
    return {
      _id: role._id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      userCount: userCount
    };
  });
  
  const stats = await Promise.all(statsPromises);
  stats.sort((a, b) => b.userCount - a.userCount);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});