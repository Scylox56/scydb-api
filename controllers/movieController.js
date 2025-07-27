const Movie = require('../models/Movie');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  // Build search query
  let query = Movie.find();
  
  // Handle search parameter
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query = query.find({
      $or: [
        { title: searchRegex },
        { director: searchRegex },
        { cast: { $in: [searchRegex] } },
        { description: searchRegex },
        { genre: { $in: [searchRegex] } }
      ]
    });
  }
  
  // Handle genre filter
  if (req.query.genre) {
    query = query.find({ genre: { $in: [req.query.genre] } });
  }
  
  // Handle director filter
  if (req.query.director) {
    const directorRegex = new RegExp(req.query.director, 'i');
    query = query.find({ director: directorRegex });
  }
  
  // Handle cast filter
  if (req.query.cast) {
    const castArray = req.query.cast.split(',').map(actor => actor.trim());
    const castRegexArray = castArray.map(actor => new RegExp(actor, 'i'));
    query = query.find({ cast: { $in: castRegexArray } });
  }
  
  // Handle year range filters
  if (req.query.yearFrom || req.query.yearTo) {
    const yearFilter = {};
    if (req.query.yearFrom) yearFilter.$gte = parseInt(req.query.yearFrom);
    if (req.query.yearTo) yearFilter.$lte = parseInt(req.query.yearTo);
    query = query.find({ year: yearFilter });
  }
  
  // Handle duration filter
  if (req.query.duration) {
    const durationRange = req.query.duration;
    if (durationRange === '0-90') {
      query = query.find({ duration: { $lt: 90 } });
    } else if (durationRange === '90-120') {
      query = query.find({ duration: { $gte: 90, $lte: 120 } });
    } else if (durationRange === '120-180') {
      query = query.find({ duration: { $gte: 120, $lte: 180 } });
    } else if (durationRange === '180-') {
      query = query.find({ duration: { $gt: 180 } });
    }
  }
  
  // Handle sorting
  if (req.query.sort) {
    let sortBy = req.query.sort;
    if (sortBy === 'popular') {
      sortBy = '-createdAt';
    } else if (sortBy === 'rating') {
      sortBy = '-createdAt';
    } else if (sortBy === 'newest') {
      sortBy = '-year';
    } else if (sortBy === 'oldest') {
      sortBy = 'year';
    } else if (sortBy === 'title') {
      sortBy = 'title';
    }
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  
  // Handle pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  query = query.skip(skip).limit(limit);
  
  // Execute query
  const movies = await query.populate({
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