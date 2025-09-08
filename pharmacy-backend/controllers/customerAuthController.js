const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const axios = require('axios');

exports.signup = async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    // Validate email and phone
    if (!validator.isEmail(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (!/^03[0-9]{9}$/.test(phone)) return res.status(400).json({ message: 'Invalid phone format' });
    if (!validator.isStrongPassword(password, { minLength: 6 })) return res.status(400).json({ message: 'Password too weak' });

    // Kickbox email verification
    try {
      const apiKey = process.env.KICKBOX_API_KEY;
      console.log('KICKBOX_API_KEY:', apiKey ? '[set]' : '[not set]'); // Debug log
      if (!apiKey) {
        return res.status(500).json({ success: false, message: 'Kickbox API key not configured' });
      }
      const kickboxRes = await axios.get('https://api.kickbox.com/v2/verify', {
        params: { email, apikey: apiKey }
      });
      const result = kickboxRes.data.result;
      if (result !== 'deliverable') {
        return res.status(400).json({ success: false, message: 'Invalid or risky email address' });
      }
    } catch (err) {
      const kbData = err.response?.data;
      if (kbData?.code === 'FORBIDDEN') {
        console.error('Kickbox error (FORBIDDEN):', kbData);
        return res.status(500).json({ success: false, message: 'Kickbox API key is not permitted to use the Verification API. Enable access for this key or use a key with Email Verification permissions.' });
      }
      console.error('Kickbox error:', kbData || err.message); // Debug log
      return res.status(500).json({ success: false, message: 'Failed to validate email address', error: kbData || err.message });
    }

    const existing = await Customer.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const customer = new Customer({ email, phone, password: hash });
    await customer.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check for existing pharmacy token in headers
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded.type === 'pharmacy') {
            return res.status(403).json({ 
              message: 'A pharmacy is currently logged in. Please logout the pharmacy first.' 
            });
          }
        } catch (err) {
          // Token is invalid, continue with login
        }
      }
    }
    
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: customer._id, type: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { _id: customer._id, email: customer.email, phone: customer.phone } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 