const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const requireAuth = require('../middleware/auth');

// bootstrap first admin (protected by X-Bootstrap-Token)
router.post('/bootstrap', adminCtrl.bootstrap);

// auth
router.post('/login', adminCtrl.login);
router.get('/profile', requireAuth('admin'), adminCtrl.profile);

// stats
router.get('/stats', requireAuth('admin'), adminCtrl.stats);

// pharmacies
router.get('/pharmacies', requireAuth('admin'), adminCtrl.listPharmacies);
router.patch('/pharmacies/:id', requireAuth('admin'), adminCtrl.updatePharmacyStatus);

// customers
router.get('/customers', requireAuth('admin'), adminCtrl.listCustomers);
router.patch('/customers/:id', requireAuth('admin'), adminCtrl.updateCustomerActive);

// orders
router.get('/orders', requireAuth('admin'), adminCtrl.listOrders);
router.patch('/orders/:id', requireAuth('admin'), adminCtrl.updateOrderStatus);

module.exports = router;


