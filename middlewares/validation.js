const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');

// Validate role data
exports.validateRole = catchAsync(async (req, res, next) => {
  const { name, permissions } = req.body;

  if (!name || name.trim().length === 0) {
    return next(new AppError('Role name is required', 400));
  }

  if (name.trim().length < 2) {
    return next(new AppError('Role name must be at least 2 characters long', 400));
  }

  if (permissions && !Array.isArray(permissions)) {
    return next(new AppError('Permissions must be an array', 400));
  }

  const validPermissions = ['read', 'write', 'delete', 'admin'];
  if (permissions && permissions.some(p => !validPermissions.includes(p))) {
    return next(new AppError('Invalid permissions provided', 400));
  }

  // Sanitize name
  req.body.name = name.trim().toLowerCase();
  
  next();
});

// Validate genre data
exports.validateGenre = catchAsync(async (req, res, next) => {
  const { name, color } = req.body;

  if (!name || name.trim().length === 0) {
    return next(new AppError('Genre name is required', 400));
  }

  if (name.trim().length < 2) {
    return next(new AppError('Genre name must be at least 2 characters long', 400));
  }

  if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
    return next(new AppError('Color must be a valid hex color code', 400));
  }

  // Sanitize name
  req.body.name = name.trim();
  
  next();
});

// Validate bulk operations
exports.validateBulkGenres = catchAsync(async (req, res, next) => {
  const { genres } = req.body;

  if (!genres || !Array.isArray(genres)) {
    return next(new AppError('Genres array is required', 400));
  }

  if (genres.length === 0) {
    return next(new AppError('At least one genre is required', 400));
  }

  if (genres.length > 50) {
    return next(new AppError('Cannot update more than 50 genres at once', 400));
  }

  for (let i = 0; i < genres.length; i++) {
    const genre = genres[i];
    
    if (!genre._id) {
      return next(new AppError(`Genre at index ${i} is missing _id`, 400));
    }

    if (!genre.name || genre.name.trim().length < 2) {
      return next(new AppError(`Genre at index ${i} has invalid name`, 400));
    }

    if (genre.color && !/^#[0-9A-F]{6}$/i.test(genre.color)) {
      return next(new AppError(`Genre at index ${i} has invalid color`, 400));
    }

    // Sanitize name
    genres[i].name = genre.name.trim();
  }

  next();
});