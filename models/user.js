// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  cname: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
