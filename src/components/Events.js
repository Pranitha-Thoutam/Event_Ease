import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { eventService } from '../services/api';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');
    fetchEvents(categoryId);
  }, [location.search]);

  const fetchEvents = async (categoryId = null) => {
    try {
      setLoading(true);
      let data;
      if (categoryId) {
        data = await eventService.search({ category: categoryId });
      } else {
        data = await eventService.getAll();
      }
      setEvents(data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
      </div>

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events">
            <p>No events found.</p>
            <p>Check back soon for new events!</p>
          </div>
        ) : (
          events.map((event) => (
            <div className="event-card" key={event._id}>
              <div className="event-image">
                <img src={event.imageUrl} alt={event.name} />
                <div className="event-price">₹{event.price}</div>
              </div>
              <div className="event-content">
                <h3>{event.name}</h3>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <div className="event-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{event.location}</span>
                  </div>
                  <div className="event-detail">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  {event.eventType === "ticket" ? (
                    <div className="event-detail">
                      <i className="fas fa-ticket-alt"></i>
                      <span>{event.availableTickets} tickets left</span>
                    </div>
                  ) : (
                    <div className="event-detail">
                      <i className="fas fa-users"></i>
                      <span>Up to {event.planningDetails?.guestCount || 'N/A'} guests</span>
                    </div>
                  )}
                </div>
                <Link 
                  to={`/events/${event._id}`} 
                  className={`view-event-button ${event.eventType === "planning" ? "planning" : ""}`}
                >
                  {event.eventType === "planning" ? "Plan My Event" : "View Details"}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events; 