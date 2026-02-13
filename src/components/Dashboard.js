// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ProfilePicture from "../assets/default-profile.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { eventBookingService } from "../services/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMyBookingsPage = location.pathname === '/my-bookings';

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await eventBookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      setError("Failed to load bookings. Please try again later.");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await eventBookingService.cancel(bookingId);
      fetchBookings(); // Refresh bookings after cancellation
    } catch (err) {
      setError("Failed to cancel booking. Please try again later.");
      console.error("Error canceling booking:", err);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const renderBookings = () => {
    const filteredBookings = isMyBookingsPage 
      ? bookings 
      : bookings.filter(b => b.status === 'confirmed' && new Date(b.event.date) >= new Date());

    if (filteredBookings.length === 0) {
      return <p className="empty-bookings">No {isMyBookingsPage ? '' : 'active '}bookings found.</p>;
    }

    return (
      <table className="bookings-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Tickets</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map(booking => (
            <tr key={booking._id}>
              <td>{booking.event.name}</td>
              <td>{new Date(booking.event.date).toLocaleDateString()}</td>
              <td>{booking.numberOfTickets}</td>
              <td>₹{booking.totalPrice}</td>
              <td><span className={`status ${booking.status}`}>{booking.status}</span></td>
              <td>
                {booking.status === 'confirmed' && new Date(booking.event.date) >= new Date() && (
                  <button className="cancel-button" onClick={() => handleCancelBooking(booking._id)}>Cancel</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile-details">
          <img src={ProfilePicture} alt="User Profile" className="profile-image" />
          <h2 className="user-name">{localStorage.getItem('username') || 'User'}</h2>
          <p className="user-role">{localStorage.getItem('userRole') || 'User'}</p>
        </div>

        <div className="sidebar-options">
          <h3 className="options-title">Available Options</h3>
          <ul className="options-list">
            <li>
              <Link to="/dashboard" className={`option-item ${!isMyBookingsPage ? 'active' : ''}`}>
                <i className="fas fa-tachometer-alt option-icon"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/my-bookings" className={`option-item ${isMyBookingsPage ? 'active' : ''}`}>
                <i className="fas fa-receipt option-icon"></i> My Bookings
              </Link>
            </li>
            {localStorage.getItem('userRole') === 'admin' && (
              <li>
                <Link to="/admin/dashboard" className="option-item">
                  <i className="fas fa-user-shield option-icon"></i> Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link to="/edit-profile" className="option-item">
                <i className="fas fa-user-edit option-icon"></i> Edit Profile
              </Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-actions">
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt action-icon"></i> Log-out
          </button>
        </div>
      </div>

      <div className="main-dashboard-content">
        {isMyBookingsPage ? (
          <div className="active-bookings-section">
            <h3 className="section-title">My Bookings</h3>
            {renderBookings()}
          </div>
        ) : (
          <>
            <div className="welcome-section">
              <h1 className="welcome-text">Welcome {localStorage.getItem('username') || 'User'}</h1>
              <div className="welcome-stats">
                <div className="stat-card">
                  <h3>Total Bookings</h3>
                  <p>{bookings.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Bookings</h3>
                  <p>{bookings.filter(b => b.status === 'confirmed' && new Date(b.event.date) >= new Date()).length}</p>
                </div>
              </div>
            </div>

            <div className="metric-cards-grid">
              <div className="metric-card primary">
                <div className="card-icon"><i className="fas fa-ticket-alt"></i></div>
                <div className="card-content">
                  <h4>{bookings.length}</h4>
                  <p>Total Bookings</p>
                </div>
              </div>
              <div className="metric-card success">
                <div className="card-icon"><i className="fas fa-check-circle"></i></div>
                <div className="card-content">
                  <h4>{bookings.filter(b => b.status === 'confirmed').length}</h4>
                  <p>Confirmed</p>
                </div>
              </div>
              <div className="metric-card warning">
                <div className="card-icon"><i className="fas fa-clock"></i></div>
                <div className="card-content">
                  <h4>{bookings.filter(b => b.status === 'pending').length}</h4>
                  <p>Pending</p>
                </div>
              </div>
              <div className="metric-card danger">
                <div className="card-icon"><i className="fas fa-times-circle"></i></div>
                <div className="card-content">
                  <h4>{bookings.filter(b => b.status === 'cancelled').length}</h4>
                  <p>Cancelled</p>
                </div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="active-bookings-section">
                <h3 className="section-title">Active Bookings</h3>
                {renderBookings()}
              </div>

              <div className="analytics-section">
                <h3 className="section-title">Analytics</h3>
                <div className="chart-placeholder">
                  <p>Booking statistics and trends will be displayed here.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
