const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo('client', 'admin', 'super-admin'), reviewController.createReview);


router
  .route('/:id')
  .delete(reviewController.deleteReview);

module.exports = router;  