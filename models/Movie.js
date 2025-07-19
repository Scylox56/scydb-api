const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
    type: String,
    required: [true, 'A movie must have a title'],
    unique: true,
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'A movie must have a release year']
  },
  duration: {
    type: Number,
    required: [true, 'A movie must have a duration']
  },
  genre: {
    type: [String],
    required: [true, 'A movie must have at least one genre']
  },
  director: {
    type: String,
    required: [true, 'A movie must have a director']
  },
  cast: {
    type: [String],
    required: [true, 'A movie must have at least one actor']
  },
  description: {
    type: String,
    required: [true, 'A movie must have a description'],
    trim: true
  },
  poster: {
    type: String,
    required: [true, 'A movie must have a poster']
  },
  backdrop: {
    type: String,
    required: [true, 'A movie must have a backdrop image']
  },
  trailer: {
    type: String,
    required: [true, 'A movie must have a trailer']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
  }, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


movieSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'movie',
  localField: '_id'
});

// average ratings
movieSchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.reviews.length;
  }
  return 0;
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;