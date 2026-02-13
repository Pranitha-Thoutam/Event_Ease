import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingConfirmation.css";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingDetails, type, eventName, formData, price } = location.state || {};

  if (!location.state) {
    return (
      <div className="booking-confirmation">
        <div className="error-card">
          <h2>Booking Information Not Found</h2>
          <p>Please try booking again.</p>
          <button onClick={() => navigate('/events')} className="back-button">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-confirmation">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h2>{type === 'planning' ? 'Planning Request Submitted!' : 'Booking Confirmed!'}</h2>
        
        <div className="booking-details">
          <h3>{type === 'planning' ? 'Planning Request Details' : 'Booking Details'}</h3>
          <p><strong>Event:</strong> {eventName}</p>
          
          {type === 'planning' ? (
            <>
              <p><strong>Event Date:</strong> {new Date(formData.eventDate).toLocaleDateString()}</p>
              <p><strong>Number of Guests:</strong> {formData.guestCount}</p>
              <p><strong>Package Type:</strong> {formData.packageType.charAt(0).toUpperCase() + formData.packageType.slice(1)}</p>
              <p><strong>Venue:</strong> {formData.venue || 'To be decided'}</p>
              <p><strong>Theme:</strong> {formData.theme || 'To be decided'}</p>
              {formData.additionalServices.length > 0 && (
                <p><strong>Additional Services:</strong> {formData.additionalServices.join(', ')}</p>
              )}
              <p><strong>Contact Name:</strong> {formData.contactName}</p>
              <p><strong>Contact Email:</strong> {formData.contactEmail}</p>
              <p><strong>Contact Phone:</strong> {formData.contactPhone}</p>
              {formData.budget && <p><strong>Budget Range:</strong> {formData.budget}</p>}
              {formData.specialRequirements && (
                <p><strong>Special Requirements:</strong> {formData.specialRequirements}</p>
              )}
            </>
          ) : (
            <>
              <p><strong>Booking ID:</strong> {bookingDetails._id}</p>
              <p><strong>Number of Tickets:</strong> {bookingDetails.numberOfTickets}</p>
              <p><strong>Total Amount:</strong> ₹{price}</p>
              <p><strong>Status:</strong> {bookingDetails.status}</p>
              <p><strong>Payment Status:</strong> {bookingDetails.paymentStatus}</p>
            </>
          )}
        </div>

        <div className="confirmation-message">
          {type === 'planning' ? (
            <p>Our team will review your planning request and contact you within 24 hours to discuss the details further.</p>
          ) : (
            <p>Thank you for your booking! You can view your booking details in your account.</p>
          )}
        </div>

        <div className="confirmation-actions">
          {type === 'planning' ? (
            <button onClick={() => navigate('/events')} className="browse-button">
              Browse More Events
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/my-bookings')} className="view-bookings-button">
                View My Bookings
              </button>
              <button onClick={() => navigate('/events')} className="browse-button">
                Browse More Events
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
