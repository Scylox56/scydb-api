const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authController = require('../controllers/authController');

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(authController.protect, authController.restrictTo('admin', 'super-admin'), movieController.createMovie);

router
  .route('/:id')
  .get(movieController.getMovie)
  .patch(authController.protect, authController.restrictTo('admin', 'super-admin'), movieController.updateMovie)
  .delete(authController.protect, authController.restrictTo('admin', 'super-admin'), movieController.deleteMovie);

module.exports = router;