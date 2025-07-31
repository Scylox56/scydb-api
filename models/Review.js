const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty'],
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'A review must have a rating']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: 'Movie',
    required: [true, 'Review must belong to a movie']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
}, {
  toJSON: {virtuals: true},
  toObject: { virtuals: true}
});
// prevent dupe reviews
reviewSchema.index({ movie: 1, user: 1}, {unique: true});

// add user data to review
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  }).populate({
    path: 'movie',
    select: 'title poster'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;