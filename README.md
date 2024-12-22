# Life Management App

A comprehensive life management application that helps you organize your daily life with todo lists, calendar events, and notes.

## Features

- **Todo List Management**
  - Create, edit, and delete todos
  - Set priorities (High, Medium, Low)
  - Set due dates
  - Filter by priority
  - Sort by creation time, due date, or priority
  - Mark todos as completed

- **Calendar Events**
  - Create and manage events
  - Support for all-day events
  - Month, week, and day views
  - Drag and drop event management
  - Color coding for different event types

- **Notes with Markdown Support**
  - Create and edit notes with Markdown formatting
  - Tag system for organization
  - Real-time Markdown preview
  - Search notes by tags

- **Share Function**
  - Share todos, events, and notes with others
  - Set access permissions (read-only or edit)
  - Set expiration dates for shared content
  - Email notification system

## Tech Stack

### Frontend
- React.js
- Material-UI
- FullCalendar
- React Markdown
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository：
```
bash
git clone https://github.com/your-username/life-management-app.git
cd life-management-app
```
2. Install backend dependencies:
```
bash
cd server
npm install
```
3. Install frontend dependencies:
```
bash
cd client
npm install
```
4. Create environment variables:

Create a `.env` file in the server directory with the following content:
```
env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/life-management
FRONTEND_URL=http://localhost:3000
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```
## Running the Application

1. Start MongoDB service:
```
bash
cd server
npm start
```
3. Start the frontend development server:
```
bash
cd client
npm start
```
The application will be available at `http://localhost:3000`

## API Endpoints

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `PATCH /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Notes
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create new note
- `PATCH /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/tags/:tag` - Get notes by tag

### Sharing
- `POST /api/shares` - Create share link
- `GET /api/shares/:shareId` - Get shared content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- Material-UI for the beautiful components
- FullCalendar for the calendar functionality
- React Markdown for Markdown support

## Contact

Yebo Qin - yebo7in@gmail.com
Project Link: https://github.com/yebo7in/life-management-app
