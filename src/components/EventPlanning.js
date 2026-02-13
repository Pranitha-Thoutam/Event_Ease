import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import './EventPlanning.css';

const EventPlanning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    eventDate: '',
    guestCount: '',
    packageType: 'base',
    additionalServices: [],
    specialRequirements: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    venue: '',
    theme: '',
    budget: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      additionalServices: checked 
        ? [...prev.additionalServices, value]
        : prev.additionalServices.filter(service => service !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send the form data to your backend
      console.log('Submitting planning request:', formData);
      // Navigate to confirmation page
      navigate('/booking-confirmation', { 
        state: { 
          type: 'planning',
          eventName: event.name,
          formData: formData
        }
      });
    } catch (err) {
      setError("Failed to submit planning request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="planning-loading">
        <div className="loading-spinner"></div>
        <p>Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return <div className="error-message">{error || "Event not found"}</div>;
  }

  return (
    <div className="event-planning-page">
      <div className="planning-header">
        <h1>Plan Your {event.name}</h1>
        <p className="subtitle">Fill out the form below to start planning your event</p>
      </div>

      <form onSubmit={handleSubmit} className="planning-form">
        <div className="form-section">
          <h2>Event Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="eventDate">Event Date</label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="guestCount">Number of Guests</label>
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleInputChange}
                min="1"
                max={event.planningDetails.guestCount}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue">Preferred Venue</label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleInputChange}
                placeholder="Enter venue name or location"
              />
            </div>

            <div className="form-group">
              <label htmlFor="theme">Event Theme</label>
              <input
                type="text"
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                placeholder="Enter event theme"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Package Selection</h2>
          <div className="package-options">
            <div className="package-option">
              <input
                type="radio"
                id="base"
                name="packageType"
                value="base"
                checked={formData.packageType === 'base'}
                onChange={handleInputChange}
              />
              <label htmlFor="base">
                <h3>Base Package</h3>
                <p className="price">₹{event.price}</p>
                <ul>
                  <li>Basic event planning</li>
                  <li>Venue setup</li>
                  <li>Basic decoration</li>
                  <li>Standard catering</li>
                </ul>
              </label>
            </div>

            <div className="package-option">
              <input
                type="radio"
                id="premium"
                name="packageType"
                value="premium"
                checked={formData.packageType === 'premium'}
                onChange={handleInputChange}
              />
              <label htmlFor="premium">
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
              </label>
            </div>

            <div className="package-option">
              <input
                type="radio"
                id="custom"
                name="packageType"
                value="custom"
                checked={formData.packageType === 'custom'}
                onChange={handleInputChange}
              />
              <label htmlFor="custom">
                <h3>Custom Package</h3>
                <p className="price">Contact Us</p>
                <ul>
                  <li>Customized planning</li>
                  <li>Personalized services</li>
                  <li>Flexible options</li>
                  <li>Tailored to your needs</li>
                </ul>
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Additional Services</h2>
          <div className="services-grid">
            {event.planningDetails.customizations.map((service, index) => (
              <div key={index} className="service-option">
                <input
                  type="checkbox"
                  id={`service-${index}`}
                  value={service}
                  checked={formData.additionalServices.includes(service)}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor={`service-${index}`}>{service}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="contactName">Full Name</label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactEmail">Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contactPhone">Phone Number</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="budget">Budget Range</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="Enter your budget range"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Special Requirements</h2>
          <div className="form-group">
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              placeholder="Enter any special requirements or preferences for your event"
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit Planning Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventPlanning; 