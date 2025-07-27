const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authController = require('../controllers/authController');

// Protect all routes - require authentication
router.use(authController.protect);

// Public routes for all authenticated users
router.get('/', roleController.getAllRoles);
router.get('/stats', roleController.getRoleStats);
router.get('/:id', roleController.getRole);

// Restrict to super-admin only for CUD operations
router.use(authController.restrictTo('super-admin'));

router.post('/', roleController.createRole);
router
  .route('/:id')
  .patch(roleController.updateRole)
  .delete(roleController.deleteRole);

module.exports = router;