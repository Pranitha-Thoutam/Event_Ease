// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Events from "./components/Events";
import EventDetail from "./components/EventDetail";
import Booking from "./components/Booking";
import BookingPage from "./components/BookingPage";
import Dashboard from "./components/Dashboard";
import AddEvent from "./components/AddEvent";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EditProfile from "./components/EditProfile";
import BookingConfirmation from "./components/BookingConfirmation";
import EventPlanning from './components/EventPlanning';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
// import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import AuthProvider and useAuth
import "./App.css";

// Initialize Stripe
const stripePromise = loadStripe('your_publishable_key'); // Replace with your Stripe publishable key

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'admin');
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  const handleAuthChange = () => {
    checkAuthStatus();
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          isAdmin={isAdmin} 
          handleAuthChange={handleAuthChange} 
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onAuthChange={handleAuthChange} />} />
          <Route path="/signup" element={<Signup onAuthChange={handleAuthChange} />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/book-planning/:id" element={<EventPlanning />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route 
            path="/book-tickets" 
            element={
              <Elements stripe={stripePromise}>
                <BookingPage />
              </Elements>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-event" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                <AddEvent />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EditProfile onAuthChange={handleAuthChange} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

// // New component to use the AuthContext
// function AppContent() {
//   const { isAuthenticated, isAdmin, loading } = useAuth();

//   if (loading) {
//     return <div>Loading authentication...</div>; // Or a loading spinner
//   }

//   return (
//     <div className="App">
//       <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/events" element={<Events />} />
//         <Route path="/events/:id" element={<EventDetail />} />
//         <Route path="/booking/:id" element={<Booking />} />
//         <Route 
//           path="/book-tickets" 
//           element={
//             <Elements stripe={stripePromise}>
//               <BookingPage />
//             </Elements>
//           } 
//         />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/add-event" element={<AddEvent />} />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/edit-profile"
//           element={
//             <ProtectedRoute isAuthenticated={isAuthenticated}>
//               <EditProfile />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/my-bookings"
//           element={
//             <ProtectedRoute isAuthenticated={isAuthenticated}>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/booking-confirmation" element={<BookingConfirmation />} />
//       </Routes>
//     </div>
//   );
// }

// // Wrap App with AuthProvider outside the App function
// function WrappedApp() {
//   return (
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   );
// }

export default App;
