const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true
  },
   email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
   photo: {
    type: String,
    default: 'default.jpg'
  },
   role: {
    type: String,
    enum: ['client', 'admin', 'super-admin'],
    default: 'client'
  },
   password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  watchLater: [{
    type:mongoose.Schema.ObjectId,
    ref: 'Movie'
  }],
  active: {
    type: Boolean,
    default: true,
    select: false
   }
  }, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});