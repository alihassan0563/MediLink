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
router.delete('/pharmacies/:id', requireAuth('admin'), adminCtrl.deletePharmacy);

// customers
router.get('/customers', requireAuth('admin'), adminCtrl.listCustomers);
router.patch('/customers/:id', requireAuth('admin'), adminCtrl.updateCustomerActive);
router.delete('/customers/:id', requireAuth('admin'), adminCtrl.deleteCustomer);

// orders
router.get('/orders', requireAuth('admin'), adminCtrl.listOrders);
router.patch('/orders/:id', requireAuth('admin'), adminCtrl.updateOrderStatus);
router.delete('/orders/:id', requireAuth('admin'), adminCtrl.deleteOrder);

module.exports = router;


