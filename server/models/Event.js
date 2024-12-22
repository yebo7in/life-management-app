const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  // Event title
  title: {
    type: String,
    required: true
  },
  // Event description
  description: String,
  // Start date and time
  start: {
    type: Date,
    required: true
  },
  // End date and time
  end: {
    type: Date,
    required: true
  },
  // All day event flag
  allDay: {
    type: Boolean,
    default: false
  },
  // Event color for display
  color: {
    type: String,
    default: '#3788d8'
  },
  // Creation timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema); 