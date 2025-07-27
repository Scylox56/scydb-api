const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const authController = require('../controllers/authController');

// Public route - no authentication required
router.get('/active', genreController.getActiveGenres);

// Protect all other routes - require authentication
router.use(authController.protect);

// Routes accessible to all authenticated users
router.get('/', genreController.getAllGenres);
router.get('/stats', genreController.getGenreStats);
router.get('/:id', genreController.getGenre);

// Restrict to admin and super-admin for CUD operations
router.use(authController.restrictTo('admin', 'super-admin'));

router.post('/', genreController.createGenre);
router.patch('/bulk', genreController.bulkUpdateGenres);

router
  .route('/:id')
  .patch(genreController.updateGenre)
  .delete(genreController.deleteGenre);

module.exports = router;