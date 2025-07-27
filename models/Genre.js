const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A genre must have a name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#3B82F6' // Default blue color for UI
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for movie count
genreSchema.virtual('movieCount', {
  ref: 'Movie',
  localField: 'name',
  foreignField: 'genre',
  count: true
});

// Index for faster queries
genreSchema.index({ name: 1 });
genreSchema.index({ isActive: 1 });

const Genre = mongoose.model('Genre', genreSchema);
module.exports = Genre;