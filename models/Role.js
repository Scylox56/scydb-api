const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A role must have a name'],
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'admin']
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
roleSchema.index({ name: 1 });

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;