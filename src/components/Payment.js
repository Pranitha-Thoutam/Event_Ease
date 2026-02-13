import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

const Payment = ({ bookingDetails, onPaymentComplete }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        setError("Please fill in all card details");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId) {
        setError("Please enter UPI ID");
        return;
      }
    }

    try {
      // Here you would typically make an API call to process the payment
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      if (onPaymentComplete) {
        onPaymentComplete();
      }
      
      // Navigate to success page
      navigate("/payment-success");
    } catch (err) {
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div className="payment-container">
      <h2>Event Booking Payment</h2>
      
      <div className="booking-summary">
        <h3>Booking Summary</h3>
        <div className="summary-details">
          <div className="summary-item">
            <span>Event:</span>
            <span>{bookingDetails.eventName}</span>
          </div>
          <div className="summary-item">
            <span>Date:</span>
            <span>{new Date(bookingDetails.date).toLocaleDateString()}</span>
          </div>
          <div className="summary-item">
            <span>Location:</span>
            <span>{bookingDetails.location}</span>
          </div>
          <div className="summary-item">
            <span>Price:</span>
            <span>₹{bookingDetails.price.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-methods">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit/Debit Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>
        </div>

        {paymentMethod === "card" && (
          <div className="card-details">
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
            </div>
            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardInputChange}
                placeholder="John Doe"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleCardInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardInputChange}
                  placeholder="123"
                  maxLength="3"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === "upi" && (
          <div className="upi-details">
            <div className="form-group">
              <label>UPI ID</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
              />
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="pay-button">
          Pay ₹{bookingDetails.price.toLocaleString("en-IN")}
        </button>
      </form>
    </div>
  );
};

export default Payment;
