const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// does not require login(auth)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/check-auth', authController.checkAuth);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.patch('/updateMyPassword', authController.updatePassword);
router.delete('/deleteMe', userController.deleteMe);

router.post('/watchlist/:movieId', userController.addToWatchlist);
router.delete('/watchlist/:movieId', userController.removeFromWatchlist);

// Available for admins to get roles for dropdowns
router.get('/available-roles', authController.restrictTo('admin', 'super-admin'), userController.getAvailableRoles);

router.use(authController.restrictTo('admin', 'super-admin'));

router.get('/', userController.getAllUsers);
router.get('/stats', userController.getUserStats);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.patch('/:id/role', authController.restrictTo('super-admin'), userController.toggleUserRole);

module.exports = router;