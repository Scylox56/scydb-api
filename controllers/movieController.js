const Movie = require('../models/Movie');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllMovies = catchAsync(async (req, res, next) => {
  // Build base filter object
  let filterConditions = {};
  
  // Handle search parameter
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filterConditions.$or = [
      { title: searchRegex },
      { director: searchRegex },
      { cast: { $in: [searchRegex] } },
      { description: searchRegex },
      { genre: { $in: [searchRegex] } }
    ];
  }
  
  // Handle genre filter
  if (req.query.genre) {
    filterConditions.genre = { $in: [req.query.genre] };
  }
  
  // Handle director filter
  if (req.query.director) {
    const directorRegex = new RegExp(req.query.director, 'i');
    filterConditions.director = directorRegex;
  }
  
  // Handle cast filter
  if (req.query.cast) {
    const castArray = req.query.cast.split(',').map(actor => actor.trim());
    const castRegexArray = castArray.map(actor => new RegExp(actor, 'i'));
    filterConditions.cast = { $in: castRegexArray };
  }
  
  // Handle year range filters
  if (req.query.yearFrom || req.query.yearTo) {
    const yearFilter = {};
    if (req.query.yearFrom) yearFilter.$gte = parseInt(req.query.yearFrom);
    if (req.query.yearTo) yearFilter.$lte = parseInt(req.query.yearTo);
    filterConditions.year = yearFilter;
  }
  
  // Handle duration filter
  if (req.query.duration) {
    const durationRange = req.query.duration;
    if (durationRange === '0-90') {
      filterConditions.duration = { $lt: 90 };
    } else if (durationRange === '90-120') {
      filterConditions.duration = { $gte: 90, $lte: 120 };
    } else if (durationRange === '120-180') {
      filterConditions.duration = { $gte: 120, $lte: 180 };
    } else if (durationRange === '180-') {
      filterConditions.duration = { $gt: 180 };
    }
  }
  
  // Handle rating filter
  if (req.query.minRating) {
    // This requires aggregation since averageRating is a virtual field
    // For now, we'll handle this in the frontend or add it as a real field
  }
  
  // Handle pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  
  // Get total count with the same filters
  const totalResults = await Movie.countDocuments(filterConditions);
  
  // Handle sorting
  let sortBy = '-createdAt'; // default
  if (req.query.sort) {
    if (req.query.sort === 'popular') {
      sortBy = '-createdAt';
    } else if (req.query.sort === 'rating') {
      sortBy = '-averageRating'; // Note: this might need aggregation for virtual fields
    } else if (req.query.sort === 'newest') {
      sortBy = '-year';
    } else if (req.query.sort === 'oldest') {
      sortBy = 'year';
    } else if (req.query.sort === 'title') {
      sortBy = 'title';
    } else {
      sortBy = req.query.sort; // Allow direct sort strings like '-createdAt'
    }
  }
  
  // Build and execute query
  const movies = await Movie.find(filterConditions)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'reviews',
      select: '-__v -createdAt'
    })
    .select('-__v');

  // Calculate pagination info
  const totalPages = Math.ceil(totalResults / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: { 
      movies,
      totalResults,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPrevPage,
      pagination: {
        page,
        limit,
        totalPages,
        totalResults,
        hasNextPage,
        hasPrevPage
      }
    }
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