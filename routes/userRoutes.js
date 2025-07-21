const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// does not require login(auth)
router.post('/signup', authController.signup); 

// requires login
router.use(authController.protect);

router.get('/me', userController.getMe);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// watchlist routes
router.post('/watchlist/:movieId', userController.addToWatchlist);
router.delete('/watchlist/:movieId', userController.removeFromWatchlist);

// admin-only routes
router.use(authController.restrictTo('admin', 'super-admin'));
router.get('/', userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
