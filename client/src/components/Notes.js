import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  makeStyles
} from '@material-ui/core';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@material-ui/icons';
import '../styles/Notes.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(3),
  },
  notesList: {
    height: 'calc(100vh - 200px)',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  noteContent: {
    padding: theme.spacing(3),
    height: 'calc(100vh - 200px)',
    overflow: 'auto',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  noteEditor: {
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const Notes = () => {
  const classes = useStyles();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [],
    category: 'Uncategorized'
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('获取笔记失败:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (selectedNote) {
        await axios.patch(`http://localhost:5000/api/notes/${selectedNote._id}`, newNote);
      } else {
        await axios.post('http://localhost:5000/api/notes', newNote);
      }
      setOpenDialog(false);
      setEditMode(false);
      fetchNotes();
    } catch (error) {
      console.error('保存笔记失败:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setSelectedNote(null);
      fetchNotes();
    } catch (error) {
      console.error('删除笔记失败:', error);
    }
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      setNewNote({
        ...newNote,
        tags: [...new Set([...newNote.tags, tagInput.trim()])]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper>
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Notes List</Typography>
              <IconButton onClick={() => {
                setSelectedNote(null);
                setNewNote({ title: '', content: '', tags: [], category: 'Uncategorized' });
                setOpenDialog(true);
              }}>
                <AddIcon />
              </IconButton>
            </div>
            <Divider />
            <List className={classes.notesList}>
              {notes.map((note) => (
                <ListItem
                  button
                  key={note._id}
                  selected={selectedNote && selectedNote._id === note._id}
                  onClick={() => setSelectedNote(note)}
                >
                  <ListItemText
                    primary={note.title}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textSecondary">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </Typography>
                        {note.tags.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            className={classes.chip}
                          />
                        ))}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedNote && (
            <Paper className={classes.noteContent}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography variant="h5">{selectedNote.title}</Typography>
                <div>
                  <IconButton onClick={() => {
                    setNewNote(selectedNote);
                    setOpenDialog(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(selectedNote._id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedNote ? '编辑笔记' : '新建笔记'}
        </DialogTitle>
        <DialogContent className={classes.noteEditor}>
          <TextField
            label="标题"
            fullWidth
            value={newNote.title}
            onChange={(e) => setNewNote({...newNote, title: e.target.value})}
          />
          <TextField
            label="内容"
            fullWidth
            multiline
            rows={12}
            value={newNote.content}
            onChange={(e) => setNewNote({...newNote, content: e.target.value})}
          />
          <TextField
            label="添加标签"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleAddTag}
            helperText="按回车添加标签"
          />
          <div>
            {newNote.tags.map(tag => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                className={classes.chip}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            取消
          </Button>
          <Button onClick={handleSave} color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Notes; 