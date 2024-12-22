import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Container,
  makeStyles
} from '@material-ui/core';
import '../styles/Calendar.css';

const useStyles = makeStyles((theme) => ({
  calendar: {
    marginTop: theme.spacing(3),
    '& .fc': {
      fontFamily: theme.typography.fontFamily
    }
  },
  formField: {
    marginBottom: theme.spacing(2)
  }
}));

const Calendar = () => {
  const classes = useStyles();
  const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    color: '#3788d8'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events');
      setEvents(response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    } catch (error) {
      console.error('获取日历事件失败:', error);
    }
  };

  const handleDateSelect = (selectInfo) => {
    setNewEvent({
      title: '',
      description: '',
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
      color: '#3788d8'
    });
    setSelectedEvent(null);
    setOpenDialog(true);
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setNewEvent({
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description || '',
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      allDay: clickInfo.event.allDay,
      color: clickInfo.event.backgroundColor
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (selectedEvent) {
        await axios.patch(`http://localhost:5000/api/events/${selectedEvent.id}`, newEvent);
      } else {
        await axios.post('http://localhost:5000/api/events', newEvent);
      }
      setOpenDialog(false);
      fetchEvents();
    } catch (error) {
      console.error('保存事件失败:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedEvent) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${selectedEvent.id}`);
        setOpenDialog(false);
        fetchEvents();
      } catch (error) {
        console.error('删除事件失败:', error);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <div className={classes.calendar}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          locale={zhCnLocale}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
        />
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEvent ? 'Edit Event' : 'New Event'}
        </DialogTitle>
        <DialogContent>
          <TextField
            className={classes.formField}
            label="Title"
            fullWidth
            value={newEvent.title}
            onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
          />
          <TextField
            className={classes.formField}
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
          />
          <TextField
            className={classes.formField}
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={newEvent.start}
            onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            className={classes.formField}
            label="End Time"
            type="datetime-local"
            fullWidth
            value={newEvent.end}
            onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newEvent.allDay}
                onChange={(e) => setNewEvent({...newEvent, allDay: e.target.checked})}
              />
            }
            label="All Day Event"
          />
        </DialogContent>
        <DialogActions>
          {selectedEvent && (
            <Button onClick={handleDelete} color="secondary">
              删除
            </Button>
          )}
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

export default Calendar; 