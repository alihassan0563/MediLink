const Admin = require('../models/Admin');
const Pharmacy = require('../models/Pharmacy');
const Customer = require('../models/Customer');
const Request = require('../models/Request');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.bootstrap = async (req, res) => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_BOOTSTRAP_TOKEN, BOOTSTRAP_TOKEN } = process.env;
    const tokenFromHeader = req.headers['x-bootstrap-token'];
    const allowedToken = ADMIN_BOOTSTRAP_TOKEN || BOOTSTRAP_TOKEN;
    if (!allowedToken || tokenFromHeader !== allowedToken) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.status(400).json({ message: 'ADMIN_EMAIL and ADMIN_PASSWORD must be set in env' });
    }
    let admin = await Admin.findOne({ email: ADMIN_EMAIL });
    if (admin) return res.json({ message: 'Admin already exists' });
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    admin = await Admin.create({ email: ADMIN_EMAIL, password: hash, role: 'superadmin' });
    res.json({ message: 'Admin created', admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id, type: 'admin', role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { _id: admin._id, email: admin.email, role: admin.role, name: admin.name } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.profile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.stats = async (req, res) => {
  try {
    const [customers, pharmacies, orders, pendingPharmacies] = await Promise.all([
      Customer.countDocuments({}),
      Pharmacy.countDocuments({}),
      Request.countDocuments({}),
      Pharmacy.countDocuments({ status: 'pending' })
    ]);
    res.json({ customers, pharmacies, orders, pendingPharmacies });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listPharmacies = async (req, res) => {
  try {
    const list = await Pharmacy.find({}).select('-password');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePharmacyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isActive } = req.body;
    const update = {};
    if (status) update.status = status; // 'pending' | 'approved' | 'rejected'
    if (typeof isActive === 'boolean') update.isActive = isActive;
    const doc = await Pharmacy.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!doc) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deletePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Pharmacy.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Pharmacy not found' });
    res.json({ message: 'Pharmacy deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listCustomers = async (req, res) => {
  try {
    const list = await Customer.find({}).select('-password');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCustomerActive = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') return res.status(400).json({ message: 'isActive must be boolean' });
    const doc = await Customer.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password');
    if (!doc) return res.status(404).json({ message: 'Customer not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const list = await Request.find({}).populate('customer', 'email phone').populate('acceptedBy', 'pharmacyName');
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, statusMessage } = req.body; // allow admin message
    if (!['completed', 'cancelled', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const doc = await Request.findByIdAndUpdate(id, { status, statusMessage }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Order not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Request.findByIdAndUpdate(
      id,
      { status: 'rejected', statusMessage: 'Rejected by admin' },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order rejected by admin', order: doc });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


