import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import ShareDialog from './ShareDialog';
import { makeStyles } from '@material-ui/core/styles';
import '../styles/TodoList.css';

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
    marginRight: theme.spacing(2)
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  priorityHigh: {
    backgroundColor: '#ff7961'
  },
  priorityMedium: {
    backgroundColor: '#ffb74d'
  },
  priorityLow: {
    backgroundColor: '#81c784'
  }
}));

const TodoList = () => {
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: ''
  });
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedTodoForShare, setSelectedTodoForShare] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('获取待办事项失败:', error);
    }
  };

  const getFilteredAndSortedTodos = () => {
    let filteredTodos = [...todos];
    
    if (priorityFilter !== 'All') {
      filteredTodos = filteredTodos.filter(todo => todo.priority === priorityFilter);
    }
    
    filteredTodos.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return filteredTodos;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/todos', newTodo);
      setNewTodo({ 
        title: '', 
        description: '', 
        priority: 'Medium', 
        dueDate: '' 
      });
      fetchTodos();
    } catch (error) {
      console.error('创建待办事项失败:', error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}`, {
        completed: !completed
      });
      fetchTodos();
    } catch (error) {
      console.error('更新待办事项失败:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('删除待办事项失败:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return classes.priorityHigh;
      case 'Medium':
        return classes.priorityMedium;
      case 'Low':
        return classes.priorityLow;
      default:
        return '';
    }
  };

  const handleShare = (todo) => {
    setSelectedTodoForShare(todo);
    setShareDialogOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Todo List
      </Typography>
      
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel>Priority Filter</InputLabel>
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt">Creation Time</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({...newTodo, priority: e.target.value})}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={newTodo.dueDate}
              onChange={(e) => setNewTodo({...newTodo, dueDate: e.target.value})}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              fullWidth
              style={{ height: '100%' }}
            >
              Add Todo
            </Button>
          </Grid>
        </Grid>
      </form>

      <List>
        {getFilteredAndSortedTodos().map((todo) => (
          <ListItem key={todo._id} dense button>
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleComplete(todo._id, todo.completed)}
            />
            <ListItemText
              primary={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    marginRight: 8
                  }}>
                    {todo.title}
                  </span>
                  <Chip
                    label={todo.priority}
                    size="small"
                    className={`${classes.chip} ${getPriorityColor(todo.priority)}`}
                  />
                  {todo.dueDate && (
                    <Chip
                      label={new Date(todo.dueDate).toLocaleDateString()}
                      size="small"
                      className={classes.chip}
                    />
                  )}
                </div>
              }
              secondary={todo.description}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleShare(todo)}>
                <ShareIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => deleteTodo(todo._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {selectedTodoForShare && (
        <ShareDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          type="todo"
          contentId={selectedTodoForShare._id}
          title={selectedTodoForShare.title}
        />
      )}
    </Container>
  );
};

export default TodoList; 