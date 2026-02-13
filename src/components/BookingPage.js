import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventBookingService } from '../services/api';
import './BookingPage.css';

const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet'
};

// Add payment recipient details
const PAYMENT_RECIPIENT = {
  name: "EventEase",
  accountNumber: "YOUR_IDBI_ACCOUNT_NUMBER",
  bankName: "IDBI Bank",
  ifscCode: "IBKL0000XXX",
  upiId: "7386230415@ybl",
  gstin: "YOUR_GSTIN_NUMBER"
};

const NET_BANKING_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
  { id: 'pnb', name: 'Punjab National Bank' }
];

const WALLET_OPTIONS = [
  { id: 'paytm', name: 'Paytm' },
  { id: 'phonepe', name: 'PhonePe' },
  { id: 'amazonpay', name: 'Amazon Pay' },
  { id: 'gpay', name: 'Google Pay' }
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
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    netBanking: '',
    amount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [bookingType, setBookingType] = useState(''); // 'paid' or 'unpaid'

  useEffect(() => {
    if (!location.state?.eventId) {
      navigate('/events');
      return;
    }
    // Calculate total amount including GST
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
      netBanking: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        eventId: location.state.eventId,
        startDate: new Date().toISOString(), // Current date as start date
        endDate: new Date(Date.now() + 24*60*60*1000).toISOString(), // Next day as end date
        numberOfTickets: formData.quantity,
        specialRequests: `Contact: ${formData.phone}, Email: ${formData.email}`,
        totalPrice: formData.amount,
        paymentStatus: bookingType === 'paid' ? 'pending' : 'not_required',
        status: 'pending'
      };

      if (bookingType === 'paid') {
        // Handle payment processing
        if (!stripe || !elements) {
          throw new Error('Stripe not initialized');
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });
        if (error) {
          throw new Error(error.message);
        }
        // Here you would send paymentMethod.id to your backend
        console.log('Card payment successful:', paymentMethod);
      } else {
        // Create booking without payment
        const response = await eventBookingService.create(bookingData);
        navigate('/booking-confirmation', { 
          state: { 
            bookingDetails: response,
            type: 'event',
            itemName: location.state.eventName,
            price: formData.amount
          }
        });
      }
    } catch (error) {
      setError('Failed to process booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentDetails = () => {
    switch (formData.paymentMethod) {
      case PAYMENT_METHODS.CARD:
        return (
          <div className="form-group">
            <label>Card Details</label>
            <div className="card-element-container">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
        );

      case PAYMENT_METHODS.UPI:
        return (
          <div className="form-group">
            <label>UPI ID</label>
            <input
              type="text"
              name="upiId"
              value={formData.upiId}
              onChange={handleInputChange}
              placeholder="example@upi"
              required
            />
          </div>
        );

      case PAYMENT_METHODS.NET_BANKING:
        return (
          <div className="form-group">
            <label>Select Bank</label>
            <select
              name="netBanking"
              value={formData.netBanking}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a bank</option>
              {NET_BANKING_BANKS.map(bank => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPaymentRecipientDetails = () => {
    return (
      <div className="payment-recipient">
        <h3>Payment Recipient Details</h3>
        <div className="recipient-info">
          <div className="info-row">
            <span>Recipient Name:</span>
            <span>{PAYMENT_RECIPIENT.name}</span>
          </div>
          <div className="info-row">
            <span>GSTIN:</span>
            <span>{PAYMENT_RECIPIENT.gstin}</span>
          </div>
          {formData.paymentMethod === PAYMENT_METHODS.NET_BANKING && (
            <>
              <div className="info-row">
                <span>Bank Name:</span>
                <span>{PAYMENT_RECIPIENT.bankName}</span>
              </div>
              <div className="info-row">
                <span>Account Number:</span>
                <span>{PAYMENT_RECIPIENT.accountNumber}</span>
              </div>
              <div className="info-row">
                <span>IFSC Code:</span>
                <span>{PAYMENT_RECIPIENT.ifscCode}</span>
              </div>
            </>
          )}
          {formData.paymentMethod === PAYMENT_METHODS.UPI && (
            <div className="info-row">
              <span>UPI ID:</span>
              <span>{PAYMENT_RECIPIENT.upiId}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPaymentConfirmation = () => {
    return (
      <div className="payment-confirmation">
        <h3>Payment Confirmation</h3>
        <p>By proceeding with the payment, you confirm that:</p>
        <ul>
          <li>You are making the payment to {PAYMENT_RECIPIENT.name}</li>
          <li>The payment is for the event: {location.state?.eventName}</li>
          <li>You will receive a confirmation email after successful payment</li>
          <li>All payments are secure and encrypted</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h2>Book Tickets for {location.state?.eventName || 'Event'}</h2>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Booking successful! You will receive a confirmation email shortly.
          </div>
        )}
        
        {!showPaymentOptions && (
          <div className="booking-type-selection">
            <h2>Select Booking Type</h2>
            <div className="booking-type-options">
              <button 
                className={`booking-type-button ${bookingType === 'paid' ? 'active' : ''}`}
                onClick={() => {
                  setBookingType('paid');
                  setShowPaymentOptions(true);
                }}
              >
                <h3>Pay Now</h3>
                <p>Secure payment processing</p>
                <p>Instant confirmation</p>
                <p>Price: ₹{formData.amount}</p>
              </button>
              
              <button 
                className={`booking-type-button ${bookingType === 'unpaid' ? 'active' : ''}`}
                onClick={() => {
                  setBookingType('unpaid');
                  setShowPaymentOptions(true);
                }}
              >
                <h3>Book Without Payment</h3>
                <p>Pay at the venue</p>
                <p>Admin approval required</p>
                <p>Price: ₹{formData.amount}</p>
              </button>
            </div>
          </div>
        )}

        {showPaymentOptions && (
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Personal Details</h2>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Number of Tickets</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {bookingType === 'paid' && (
              <>
                <div className="payment-summary">
                  <h2>Payment Summary</h2>
                  <div className="summary-row">
                    <span>Ticket Price:</span>
                    <span>₹{location.state?.eventPrice}</span>
                  </div>
                  <div className="summary-row">
                    <span>Quantity:</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="summary-row">
                    <span>GST (18%):</span>
                    <span>₹{(location.state?.eventPrice * formData.quantity * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount:</span>
                    <span>₹{formData.amount}</span>
                  </div>
                </div>

                <div className="form-section">
                  <h2>Payment Method</h2>
                  <div className="payment-methods">
                    <button
                      type="button"
                      className={`payment-method ${formData.paymentMethod === PAYMENT_METHODS.CARD ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.CARD)}
                    >
                      Credit/Debit Card
                    </button>
                    <button
                      type="button"
                      className={`payment-method ${formData.paymentMethod === PAYMENT_METHODS.UPI ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.UPI)}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      className={`payment-method ${formData.paymentMethod === PAYMENT_METHODS.NET_BANKING ? 'active' : ''}`}
                      onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.NET_BANKING)}
                    >
                      Net Banking
                    </button>
                  </div>

                  {formData.paymentMethod === PAYMENT_METHODS.CARD && (
                    <div className="card-details">
                      <div className="form-group">
                        <label>Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>CVV</label>
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === PAYMENT_METHODS.UPI && (
                    <div className="form-group">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        placeholder="example@upi"
                        required
                      />
                    </div>
                  )}

                  {formData.paymentMethod === PAYMENT_METHODS.NET_BANKING && (
                    <div className="form-group">
                      <label>Select Bank</label>
                      <select
                        name="netBanking"
                        value={formData.netBanking}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a bank</option>
                        {NET_BANKING_BANKS.map(bank => (
                          <option key={bank.id} value={bank.id}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="form-actions">
              <button type="button" className="back-button" onClick={() => setShowPaymentOptions(false)}>
                Back
              </button>
              <button type="submit" className="submit-button">
                {bookingType === 'paid' ? 'Pay Now' : 'Book Without Payment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPage; 