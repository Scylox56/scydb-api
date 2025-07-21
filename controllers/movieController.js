const Movie = require('../models/Movie');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const movies = await features.query.populate({
    path: 'reviews',
    select: '-__v -createdAt'
  }).select('-__v');

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: { movies }
  });
});

exports.getMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id)
    .populate({
      path: 'reviews',
      select: '-__v -createdAt'
    })
    .select('-__v');

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { movie }
  });
});

exports.createMovie = catchAsync(async (req, res, next) => {
  if (!req.user.role.includes('admin')) {
    return next(new AppError('Only admins can create movies', 403));
  }

  const newMovie = await Movie.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { movie: newMovie }
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  if (!req.user.role.includes('admin')) {
    return next(new AppError('Only admins can update movies', 403));
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { movie }
  });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  if (!req.user.role.includes('admin')) {
    return next(new AppError('Only admins can delete movies', 403));
  }

  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});