import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getById(id);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBookNow = () => {
    if (event.eventType === "planning") {
      navigate(`/book-planning/${id}`);
    } else {
      navigate(`/book-tickets`, { 
        state: { 
          eventId: event._id,
          eventName: event.name,
          eventPrice: event.price
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="event-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return <div className="error-message">{error || "Event not found"}</div>;
  }

  return (
    <div className="event-detail-page">
      <div className="event-header">
        <div className="event-image">
          <img src={event.imageUrl} alt={event.name} />
        </div>
        <div className="event-info">
          <h1>{event.name}</h1>
          <div className="event-meta">
            <div className="meta-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>{event.location}</span>
            </div>
            <div className="meta-item">
              <i className="fas fa-calendar-alt"></i>
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            {event.eventType === "ticket" && (
              <div className="meta-item">
                <i className="fas fa-ticket-alt"></i>
                <span>{event.availableTickets} tickets left</span>
              </div>
            )}
            {event.eventType === "planning" && (
              <div className="meta-item">
                <i className="fas fa-users"></i>
                <span>Up to {event.planningDetails.guestCount} guests</span>
              </div>
            )}
          </div>
          <div className="event-price">
            <span className="price-label">
              {event.eventType === "planning" ? "Starting from" : "Price per ticket"}
            </span>
            <span className="price-value">₹{event.price}</span>
          </div>
          <button onClick={handleBookNow} className={`book-now-button ${event.eventType === "planning" ? "planning" : ""}`}>
            {event.eventType === "planning" ? "Plan My Event" : "Book Tickets"}
          </button>
        </div>
      </div>

      <div className="event-content">
        <section className="event-description">
          <h2>About This {event.eventType === "planning" ? "Service" : "Event"}</h2>
          <p>{event.description}</p>
        </section>

        {event.eventType === "planning" && (
          <>
            <section className="planning-details">
              <h2>Planning Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <h3>Duration</h3>
                  <p>{event.planningDetails.duration}</p>
                </div>
                <div className="detail-item">
                  <h3>Services Included</h3>
                  <ul>
                    {event.planningDetails.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-item">
                  <h3>Package Inclusions</h3>
                  <ul>
                    {event.planningDetails.inclusions.map((inclusion, index) => (
                      <li key={index}>{inclusion}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-item">
                  <h3>Customization Options</h3>
                  <ul>
                    {event.planningDetails.customizations.map((customization, index) => (
                      <li key={index}>{customization}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="pricing-details">
              <h2>Pricing Details</h2>
              <div className="pricing-grid">
                <div className="pricing-item">
                  <h3>Base Package</h3>
                  <p className="price">₹{event.price}</p>
                  <ul>
                    <li>Basic event planning</li>
                    <li>Venue setup</li>
                    <li>Basic decoration</li>
                    <li>Standard catering</li>
                  </ul>
                </div>
                <div className="pricing-item featured">
                  <h3>Premium Package</h3>
                  <p className="price">₹{Math.round(event.price * 1.5)}</p>
                  <ul>
                    <li>Full event planning</li>
                    <li>Premium venue setup</li>
                    <li>Luxury decoration</li>
                    <li>Premium catering</li>
                    <li>Photography & Videography</li>
                    <li>Entertainment arrangements</li>
                  </ul>
                </div>
                <div className="pricing-item">
                  <h3>Custom Package</h3>
                  <p className="price">Contact Us</p>
                  <ul>
                    <li>Customized planning</li>
                    <li>Personalized services</li>
                    <li>Flexible options</li>
                    <li>Tailored to your needs</li>
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}

        {event.eventType === "ticket" && (
          <section className="event-features">
            <h2>Features</h2>
            <ul className="features-list">
              {event.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </section>
        )}

        {event.benefits && event.benefits.length > 0 && (
          <section className="event-benefits">
            <h2>Benefits</h2>
            <ul className="benefits-list">
              {event.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </section>
        )}

        {event.targetAudience && (
          <section className="target-audience">
            <h2>Perfect For</h2>
            <p>{event.targetAudience}</p>
          </section>
        )}

        {event.expectations && (
          <section className="expectations">
            <h2>What to Expect</h2>
            <p>{event.expectations}</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default EventDetail; 