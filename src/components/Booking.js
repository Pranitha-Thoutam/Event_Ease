import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService, eventBookingService } from '../services/api';
import './Booking.css';

const Booking = () => {
  const { id: eventId } = useParams(); // Get event ID from URL
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfTickets: 1, // Default to 1 ticket
    specialRequests: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) {
        setError("No event selected for booking.");
        setLoading(false);
        return;
      }
      try {
        const eventData = await eventService.getById(eventId);
        setEvent(eventData);
        setTotalPrice(eventData.price * formData.numberOfTickets); // Calculate initial total price
      } catch (err) {
        setError("Failed to load event details.");
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    if (event) {
      setTotalPrice(event.price * formData.numberOfTickets);
    }
  }, [formData.numberOfTickets, event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === "numberOfTickets" ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!event) {
      setError("Event details not loaded.");
      return;
    }

    try {
      const bookingData = {
        eventId: event._id,
        startDate: event.date, // Assuming event.date is the booking start date
        endDate: event.date,   // Assuming event.date is also the booking end date for single-day events
        numberOfTickets: formData.numberOfTickets,
        totalPrice: totalPrice,
        specialRequests: formData.specialRequests,
      };

      // Add user contact info if not already part of auth or pre-filled
      // For now, let's assume user is logged in and their info is handled by the backend auth middleware
      // If not, you'd need to send formData.name, formData.email, formData.phone as well.

      const response = await eventBookingService.create(bookingData);
      console.log('Booking successful:', response);
      alert('Booking successful!');
      navigate('/dashboard'); // Redirect to user dashboard after successful booking
    } catch (err) {
      console.error("Error submitting booking:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "An error occurred during booking.");
    }
  };

  if (loading) {
    return <div className="loading">Loading booking form...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!event) {
    return <div className="no-event-found">Event not found for booking.</div>;
  }

  return (
    <div className="booking-container">
      <h1>Book Event: {event.name}</h1>
      <div className="event-overview">
        {event.imageUrl && <img src={event.imageUrl} alt={event.name} className="event-image" />}
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Price per ticket:</strong> ₹{event.price}</p>
        <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
      </div>
      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numberOfTickets">Number of Tickets</label>
          <input
            type="number"
            id="numberOfTickets"
            name="numberOfTickets"
            value={formData.numberOfTickets}
            onChange={handleChange}
            min="1"
            max={event.availableTickets} // Max tickets based on available tickets
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialRequests">Special Requests</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="total-price">
          <strong>Total Price:</strong> ₹{totalPrice}
        </div>

        <button type="submit" className="submit-button">Confirm Booking</button>
      </form>
    </div>
  );
};

export default Booking; 