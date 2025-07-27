const Genre = require('../models/Genre');
const Movie = require('../models/Movie');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');
const APIFeatures = require('../utils/APIFeatures');

exports.getAllGenres = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Genre.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const genres = await features.query
    .populate('movieCount')
    .select('-__v');

  res.status(200).json({
    status: 'success',
    results: genres.length,
    data: { genres }
  });
});

exports.getActiveGenres = catchAsync(async (req, res, next) => {
  const genres = await Genre.find({ isActive: true })
    .select('name description color -_id')
    .sort('name');

  res.status(200).json({
    status: 'success',
    results: genres.length,
    data: { genres }
  });
});

exports.getGenre = catchAsync(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id)
    .populate('movieCount')
    .select('-__v');

  if (!genre) {
    return next(new AppError('No genre found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { genre }
  });
});

exports.createGenre = catchAsync(async (req, res, next) => {
  // Check if genre already exists
  const existingGenre = await Genre.findOne({ 
    name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
  });
  
  if (existingGenre) {
    return next(new AppError('Genre with this name already exists', 400));
  }

  const newGenre = await Genre.create({
    name: req.body.name,
    description: req.body.description,
    color: req.body.color,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });

  res.status(201).json({
    status: 'success',
    data: { genre: newGenre }
  });
});

exports.updateGenre = catchAsync(async (req, res, next) => {
  // Check if trying to update name and it conflicts with existing genre
  if (req.body.name) {
    const existingGenre = await Genre.findOne({ 
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
      _id: { $ne: req.params.id }
    });
    if (existingGenre) {
      return next(new AppError('Genre with this name already exists', 400));
    }
  }

  const oldGenre = await Genre.findById(req.params.id);
  if (!oldGenre) {
    return next(new AppError('No genre found with that ID', 404));
  }

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  ).select('-__v');

  // If genre name was updated, update all movies that use this genre
  if (req.body.name && req.body.name !== oldGenre.name) {
    await Movie.updateMany(
      { genre: oldGenre.name },
      { $set: { 'genre.$': req.body.name } }
    );
  }

  res.status(200).json({
    status: 'success',
    data: { genre }
  });
});

exports.deleteGenre = catchAsync(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    return next(new AppError('No genre found with that ID', 404));
  }

  // Check if any movies use this genre
  const moviesWithGenre = await Movie.countDocuments({ genre: genre.name });
  if (moviesWithGenre > 0) {
    return next(new AppError('Cannot delete genre that is used by movies. Remove it from movies first.', 400));
  }

  await Genre.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Bulk operations
exports.bulkUpdateGenres = catchAsync(async (req, res, next) => {
  const { genres } = req.body;

  if (!genres || !Array.isArray(genres)) {
    return next(new AppError('Please provide an array of genres', 400));
  }

  const operations = genres.map(genre => ({
    updateOne: {
      filter: { _id: genre._id },
      update: { 
        name: genre.name,
        description: genre.description,
        color: genre.color,
        isActive: genre.isActive
      },
      upsert: false
    }
  }));

  const result = await Genre.bulkWrite(operations);

  res.status(200).json({
    status: 'success',
    data: { 
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    }
  });
});

// Get genre statistics
exports.getGenreStats = catchAsync(async (req, res, next) => {
  const stats = await Genre.aggregate([
    {
      $lookup: {
        from: 'movies',
        localField: 'name',
        foreignField: 'genre',
        as: 'movies'
      }
    },
    {
      $project: {
        name: 1,
        description: 1,
        color: 1,
        isActive: 1,
        movieCount: { $size: '$movies' }
      }
    },
    {
      $sort: { movieCount: -1 }
    }
  ]);

  const totalGenres = await Genre.countDocuments();
  const activeGenres = await Genre.countDocuments({ isActive: true });

  res.status(200).json({
    status: 'success',
    data: { 
      stats,
      summary: {
        total: totalGenres,
        active: activeGenres,
        inactive: totalGenres - activeGenres
      }
    }
  });
});