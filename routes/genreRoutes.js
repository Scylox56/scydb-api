const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genreController');
const authController = require('../controllers/authController');
const { validateGenre, validateBulkGenres } = require('../middlewares/validation');

router.get('/active', genreController.getActiveGenres);

router.use(authController.protect);

router.get('/stats', genreController.getGenreStats);
router.get('/', genreController.getAllGenres);
router.get('/:id', genreController.getGenre);

router.use(authController.restrictTo('admin', 'super-admin'));

router.post('/', validateGenre, genreController.createGenre);
router.patch('/bulk', validateBulkGenres, genreController.bulkUpdateGenres);

router
  .route('/:id')
  .patch(validateGenre, genreController.updateGenre)
  .delete(genreController.deleteGenre);

module.exports = router;
