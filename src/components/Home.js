// Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventCategoryService } from '../services/api';
import './Home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'admin');

    const fetchCategories = async () => {
      try {
        const data = await eventCategoryService.getAll();
        setCategories(data);
      } catch (err) {
        setError("Failed to load event categories.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Your Ultimate Event Companion</h1>
          <p>Discover, Create, and Manage Unforgettable Events</p>
          {isAdmin && (
            <Link to="/add-event" className="cta-button">
              Create Event
            </Link>
          )}
          <Link to="/events" className="explore-button">
            Explore Events
          </Link>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="event-categories">
        <h2>Explore by Category</h2>
        {loading ? (
          <div className="loading-spinner"></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : categories.length === 0 ? (
          <p className="no-categories">No event categories found.</p>
        ) : (
          <div className="category-grid">
            {categories.map((category) => (
              <Link to={`/events?category=${category._id}`} className="category-box" key={category._id}>
                <div className="category-image">
                  <img src={category.imageUrl} alt={category.name} />
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose EventEase</h2>
        <div className="features-grid">
          <div className="feature-box">
            <i className="fas fa-ticket-alt feature-icon"></i>
            <h3>Lowest Fees</h3>
            <p>Affordable ticket fees that make sense.</p>
          </div>

          <div className="feature-box">
            <i className="fas fa-wifi feature-icon"></i>
            <h3>Host Virtual Events</h3>
            <p>Present memorable events online.</p>
          </div>

          <div className="feature-box">
            <i className="fas fa-tachometer-alt feature-icon"></i>
            <h3>Powerful Features</h3>
            <p>Simple dashboard with coupons and custom forms.</p>
          </div>

          <div className="feature-box">
            <i className="fas fa-mobile-alt feature-icon"></i>
            <h3>Organize on the Go</h3>
            <p>Manage events right from your phone with our app.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>How it works</h2>
        <div className="steps-grid">
          <div className="step-box">
            <span className="step-number">1</span>
            <h3>Create Event</h3>
            <p>Create an event and add a name, date, tickets and description.</p>
          </div>
          <div className="step-box">
            <span className="step-number">2</span>
            <h3>Customize Page</h3>
            <p>Add personality to your event page with details, images, videos, and more.</p>
          </div>
          <div className="step-box">
            <span className="step-number">3</span>
            <h3>Promote & Share</h3>
            <p>Share the event via social media with one click and spread the word.</p>
          </div>
          <div className="step-box">
            <span className="step-number">4</span>
            <h3>Manage Sales</h3>
            <p>Generate sales with early-bird discounts, coupons and group ticketing.</p>
          </div>
          <div className="step-box">
            <span className="step-number">5</span>
            <h3>Receive Funds</h3>
            <p>Get paid directly to your bank account according to your schedule.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} EventEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
