import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventBookingService } from '../services/api';
import './BookingPage.css';

const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking'
};

const NET_BANKING_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
  { id: 'pnb', name: 'Punjab National Bank' }
];

const BookingPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 1,
    paymentMethod: 'card',
    upiId: '',
    netBanking: '',
    amount: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bookingType, setBookingType] = useState('');

  useEffect(() => {
    if (!location.state?.eventId) {
      navigate('/events');
      return;
    }

    const basePrice = location.state.eventPrice * formData.quantity;
    const gst = basePrice * 0.18;

    setFormData(prev => ({
      ...prev,
      amount: basePrice + gst
    }));
  }, [location.state, formData.quantity, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method,
      upiId: '',
      netBanking: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        eventId: location.state.eventId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        numberOfTickets: formData.quantity,
        specialRequests: `Contact: ${formData.phone}, Email: ${formData.email}`,
        totalPrice: formData.amount,
        paymentStatus: bookingType === 'paid' ? 'pending' : 'not_required',
        status: 'pending'
      };

      if (bookingType === 'paid') {
        if (!stripe || !elements) {
          throw new Error('Stripe not initialized');
        }

        const { error } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });

        if (error) {
          throw new Error(error.message);
        }

        await eventBookingService.create(bookingData);
      } else {
        await eventBookingService.create(bookingData);
      }

      navigate('/booking-confirmation', {
        state: {
          type: 'event',
          itemName: location.state.eventName,
          price: formData.amount
        }
      });

    } catch (err) {
      setError('Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>Book Tickets for {location.state?.eventName || 'Event'}</h2>

        {error && <div className="error-message">{error}</div>}

        {!showPaymentOptions && (
          <div className="booking-type-selection">
            <h2>Select Booking Type</h2>
            <div className="booking-type-options">
              <button
                type="button"
                className={`booking-type-button ${bookingType === 'paid' ? 'active' : ''}`}
                onClick={() => {
                  setBookingType('paid');
                  setShowPaymentOptions(true);
                }}
              >
                Pay Now (₹{formData.amount})
              </button>

              <button
                type="button"
                className={`booking-type-button ${bookingType === 'unpaid' ? 'active' : ''}`}
                onClick={() => {
                  setBookingType('unpaid');
                  setShowPaymentOptions(true);
                }}
              >
                Book Without Payment (₹{formData.amount})
              </button>
            </div>
          </div>
        )}

        {showPaymentOptions && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input name="name" value={formData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            {bookingType === 'paid' && (
              <>
                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-methods">
                    <button type="button" onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.CARD)}>
                      Card
                    </button>
                    <button type="button" onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.UPI)}>
                      UPI
                    </button>
                    <button type="button" onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.NET_BANKING)}>
                      Net Banking
                    </button>
                  </div>
                </div>

                {formData.paymentMethod === PAYMENT_METHODS.CARD && (
                  <CardElement />
                )}

                {formData.paymentMethod === PAYMENT_METHODS.UPI && (
                  <input
                    name="upiId"
                    placeholder="example@upi"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    required
                  />
                )}

                {formData.paymentMethod === PAYMENT_METHODS.NET_BANKING && (
                  <select
                    name="netBanking"
                    value={formData.netBanking}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Bank</option>
                    {NET_BANKING_BANKS.map(bank => (
                      <option key={bank.id} value={bank.id}>{bank.name}</option>
                    ))}
                  </select>
                )}
              </>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Processing...' :
                bookingType === 'paid' ? 'Pay Now' : 'Book Without Payment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
