import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Typography,
  makeStyles
} from '@material-ui/core';
import { FileCopy as CopyIcon } from '@material-ui/icons';
import axios from 'axios';
import '../styles/ShareDialog.css';

const useStyles = makeStyles((theme) => ({
  formField: {
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  chip: {
    margin: theme.spacing(0.5),
  }
}));

const ShareDialog = ({ open, onClose, type, contentId, title }) => {
  const classes = useStyles();
  const [permission, setPermission] = useState('read');
  const [expiresIn, setExpiresIn] = useState('never');
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [shareUrl, setShareUrl] = useState('');

  const handleShare = async () => {
    try {
      let expiresAt = null;
      if (expiresIn !== 'never') {
        const hours = parseInt(expiresIn);
        expiresAt = new Date(Date.now() + hours * 3600000);
      }

      const response = await axios.post('http://localhost:5000/api/shares', {
        type,
        contentId,
        permission,
        expiresAt,
        emails
      });

      setShareUrl(response.data.shareUrl);
    } catch (error) {
      console.error('创建分享失败:', error);
    }
  };

  const handleAddEmail = (e) => {
    if (e.key === 'Enter' && email.trim() && email.includes('@')) {
      setEmails([...new Set([...emails, email.trim()])]);
      setEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share {title}</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formField}>
          <InputLabel>Access Permission</InputLabel>
          <Select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            <MenuItem value="read">Read Only</MenuItem>
            <MenuItem value="edit">Can Edit</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.formField}>
          <InputLabel>Expiration</InputLabel>
          <Select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
          >
            <MenuItem value="never">Never Expires</MenuItem>
            <MenuItem value="24">24 Hours</MenuItem>
            <MenuItem value="72">3 Days</MenuItem>
            <MenuItem value="168">7 Days</MenuItem>
          </Select>
        </FormControl>

        <TextField
          className={classes.formField}
          label="Add Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleAddEmail}
          helperText="Press Enter to add multiple emails"
        />

        <div>
          {emails.map(email => (
            <Chip
              key={email}
              label={email}
              onDelete={() => handleRemoveEmail(email)}
              className={classes.chip}
            />
          ))}
        </div>

        {shareUrl && (
          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle1">Share Link:</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                value={shareUrl}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  readOnly: true,
                }}
              />
              <IconButton onClick={copyToClipboard}>
                <CopyIcon />
              </IconButton>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
        <Button onClick={handleShare} color="primary">
          Create Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog; 