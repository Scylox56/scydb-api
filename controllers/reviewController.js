const Review = require('../models/Review');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/utils');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ movie: req.params.movieId })
    .select('-__v')
    .populate({
      path: 'user',
      select: 'name photo -_id'
    });

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('You must be logged in to review', 401));
  }

  try {
    const newReview = await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      movie: req.params.movieId,
      user: req.user.id
    });

    newReview.__v = undefined;

    res.status(201).json({
      status: 'success',
      data: { review: newReview }
    });

  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError('You have already reviewed this movie', 400));
    }
    return next(err);
  }
});

exports.getAllAdminReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().select('-__v');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});



exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user owns review or is admin/super-admin
  if (review.user.toString() !== req.user.id && 
      !['admin', 'super-admin'].includes(req.user.role)) {
    return next(new AppError('You can only delete your own reviews', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user owns review or is admin/super-admin
  if (review.user.toString() !== req.user.id && 
      !['admin', 'super-admin'].includes(req.user.role)) {
    return next(new AppError('You can only edit your own reviews', 403));
  }

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.id,
    {
      review: req.body.review,
      rating: req.body.rating
    },
    {
      new: true,
      runValidators: true
    }
  ).populate({
    path: 'user',
    select: 'name photo -_id'
  });

  res.status(200).json({
    status: 'success',
    data: { review: updatedReview }
  });
});