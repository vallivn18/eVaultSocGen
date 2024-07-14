// models/upload.js

const mongoose = require('mongoose');

const decorSchema = new mongoose.Schema({
  user_name: String,
  mob: String,
  email: String,
  file_name: String,
  uploadedAt: { type: Date, default: Date.now } 
});

const Upload = mongoose.model('uploads', decorSchema);

module.exports = Upload;
