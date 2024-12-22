const express = require('express');
const router = express.Router();
const Share = require('../models/Share');
const Todo = require('../models/Todo');
const Event = require('../models/Event');
const Note = require('../models/Note');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Create share link
router.post('/', async (req, res) => {
  try {
    const { type, contentId, permission, expiresAt, emails } = req.body;
    
    // Generate unique share ID
    const shareId = crypto.randomBytes(8).toString('hex');
    
    const share = new Share({
      type,
      contentId,
      shareId,
      permission,
      expiresAt: expiresAt || null,
      sharedEmails: emails || []
    });

    const savedShare = await share.save();

    // Send email notifications if email addresses are provided
    if (emails && emails.length > 0) {
      await sendShareEmails(emails, shareId, type);
    }

    res.status(201).json({
      shareId,
      shareUrl: `${process.env.FRONTEND_URL}/share/${shareId}`
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get shared content
router.get('/:shareId', async (req, res) => {
  try {
    const share = await Share.findOne({ shareId: req.params.shareId });
    
    if (!share) {
      return res.status(404).json({ message: 'Share link not found or expired' });
    }

    // Check if expired
    if (share.expiresAt && new Date() > share.expiresAt) {
      return res.status(410).json({ message: 'Share link has expired' });
    }

    // Get content based on type
    let content;
    switch (share.type) {
      case 'todo':
        content = await Todo.findById(share.contentId);
        break;
      case 'event':
        content = await Event.findById(share.contentId);
        break;
      case 'note':
        content = await Note.findById(share.contentId);
        break;
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({
      content,
      permission: share.permission
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Email sending function
async function sendShareEmails(emails, shareId, type) {
  // Create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const shareUrl = `${process.env.FRONTEND_URL}/share/${shareId}`;
  const contentTypes = {
    todo: 'Todo',
    event: 'Calendar Event',
    note: 'Note'
  };

  // Send email to each recipient
  for (const email of emails) {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Someone shared a ${contentTypes[type]} with you`,
      html: `
        <h2>Someone shared a ${contentTypes[type]} with you</h2>
        <p>Click the link below to view:</p>
        <a href="${shareUrl}">${shareUrl}</a>
        <p>This link may expire. Please check it soon.</p>
      `
    });
  }
}

module.exports = router; 