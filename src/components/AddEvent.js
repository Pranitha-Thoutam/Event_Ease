import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, eventCategoryService } from '../services/api';
import './AddEvent.css';

const AddEvent = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
    price: '',
    imageUrl: '',
    category: '',
    availableTickets: '',
    features: '',
    organizer: '',
    contactEmail: '',
    benefits: '',
    targetAudience: '',
    expectations: ''
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/'); // Redirect to home page if not admin
    }
    
    const fetchCategories = async () => {
      try {
        const data = await eventCategoryService.getAll();
        setCategories(data);
      } catch (err) {
        setError("Failed to load event categories. Please try again later.");
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, [navigate]); // Add navigate to dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert string inputs to appropriate types
      const eventData = {
        ...formData,
        price: parseFloat(formData.price),
        availableTickets: parseInt(formData.availableTickets),
        features: formData.features.split(',').map(feature => feature.trim()),
        benefits: formData.benefits.split(',').map(benefit => benefit.trim()),
        date: new Date(formData.date)
      };

      await eventService.create(eventData);
      navigate('/events');
    } catch (err) {
      setError("Failed to create event. Please try again.");
      console.error("Error creating event:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="add-event-container">
      <h1>Add New Event</h1>
      <form onSubmit={handleSubmit} className="add-event-form">
        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date and Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="availableTickets">Available Tickets</label>
          <input
            type="number"
            id="availableTickets"
            name="availableTickets"
            value={formData.availableTickets}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="features">Features (comma-separated)</label>
          <input
            type="text"
            id="features"
            name="features"
            value={formData.features}
            onChange={handleInputChange}
            placeholder="e.g., Live music, Food stalls, Networking"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="organizer">Organizer</label>
          <input
            type="text"
            id="organizer"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            placeholder="e.g., EventEase Team"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="contactEmail">Contact Email</label>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="e.g., info@eventease.com"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="benefits">Benefits (comma-separated)</label>
          <textarea
            id="benefits"
            name="benefits"
            value={formData.benefits}
            onChange={handleInputChange}
            placeholder="e.g., Learn new skills, Networking opportunities, Exclusive access"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="targetAudience">Target Audience</label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleInputChange}
            placeholder="e.g., Students, Professionals, Families"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="expectations">What to Expect</label>
          <textarea
            id="expectations"
            name="expectations"
            value={formData.expectations}
            onChange={handleInputChange}
            placeholder="e.g., Engaging speakers, Interactive workshops, Fun activities"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding Event..." : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent; 