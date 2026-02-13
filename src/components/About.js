// src/components/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>Welcome to EventEase</h1>
        <p>Your premier event management partner since 2010. We specialize in creating memorable experiences, from corporate conferences to dream weddings, making event planning seamless and stress-free.</p>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>To transform the way events are planned and executed by providing innovative solutions that make event management accessible, efficient, and enjoyable for everyone. We believe in creating experiences that leave lasting impressions.</p>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>
          <p>To be the leading event management platform known for exceptional service, cutting-edge technology, and creating meaningful connections between event planners, vendors, and clients.</p>
        </div>

        <div className="about-card">
          <h2>Our Values</h2>
          <p>Excellence, innovation, and client satisfaction drive everything we do. We're committed to transparent communication, reliable service, and delivering events that exceed expectations.</p>
        </div>
      </div>

      <div className="why-choose-us-section">
        <h2>Why Choose Us?</h2>
        <div className="choose-us-grid">
          <div className="about-card">
            <h2>Unmatched Expertise</h2>
            <p>Our team comprises seasoned professionals with years of experience in event planning and execution, ensuring every detail is handled with precision.</p>
          </div>

          <div className="about-card">
            <h2>Innovative Solutions</h2>
            <p>We leverage cutting-edge technology and creative approaches to deliver unique and engaging event experiences that stand out.</p>
          </div>

          <div className="about-card">
            <h2>Client-Centric Approach</h2>
            <p>Your vision is our priority. We work closely with you from concept to completion, ensuring your event truly reflects your aspirations.</p>
          </div>
          <div className="about-card">
            <h2>Seamless Execution</h2>
            <p>From logistics to on-site management, we ensure a smooth and flawless event, allowing you to relax and enjoy the occasion.</p>
          </div>
        </div>
      </div>

      <div className="contact-section">
        <h2>Ready to Plan Your Event?</h2>
        <p>Let's create something extraordinary together</p>
        <Link to="/contact" className="contact-button">Get Started</Link>
      </div>
    </div>
  );
};

export default About;