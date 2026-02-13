# EventEase - Event Management System

EventEase is a comprehensive event management system that allows users to browse, book, and manage events. The platform includes features for both event organizers and attendees.

## Features

- User Authentication (Login/Register)
- Event Browsing and Search
- Event Booking with Multiple Payment Options
- User Profile Management
- Admin Dashboard
- Event Categories
- Booking Management
- Responsive Design

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS3
- Stripe Integration

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/GjahnaviR/EventEase.git
cd EventEase
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

5. Create a `.env` file in the root directory for frontend:
```
REACT_APP_API_URL=http://localhost:5001/api
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5001

## Project Structure

```
EventEase/
├── backend/           # Backend server code
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── server.js     # Server entry point
├── src/              # Frontend React code
│   ├── components/   # React components
│   ├── services/     # API services
│   ├── styles/       # CSS styles
│   └── App.js        # Main App component
└── public/           # Static files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

GjahnaviR
Project Link: https://github.com/GjahnaviR/EventEase
