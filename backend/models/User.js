const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: 'resident' },
  // ADD THIS LINE:
  address: { type: String, default: 'Not set' }, 
  employeeId: { type: String, default: '' },
  auditorId: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);