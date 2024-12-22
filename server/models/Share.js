const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
  // Content type: todo, event, note
  type: {
    type: String,
    required: true,
    enum: ['todo', 'event', 'note']
  },
  // ID of shared content
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type'
  },
  // Unique identifier for share link
  shareId: {
    type: String,
    required: true,
    unique: true
  },
  // Access permission: read, edit
  permission: {
    type: String,
    enum: ['read', 'edit'],
    default: 'read'
  },
  // Share expiration date
  expiresAt: {
    type: Date
  },
  // Shared email addresses (optional)
  sharedEmails: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Share', ShareSchema); 