const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  schedule: { type: String, required: true },
  startTime: { type: String, required: true },  // Changed to String for 24-hour format
  endTime: { type: String, required: true }     // Changed to String for 24-hour format
});

// Check if the model already exists to avoid overwriting
module.exports = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
