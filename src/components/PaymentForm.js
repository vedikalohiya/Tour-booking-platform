import { useState } from "react";
import { processPayment } from "../api/apiClient";

function PaymentForm({ bookingID, totalPrice, onPaymentSuccess }) {
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: ""
  });

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        bookingID: bookingID,
        amount: totalPrice,
        currency: "INR",
        cardNumber: cardDetails.cardNumber,
        cardHolder: cardDetails.cardHolder,
        expiryDate: cardDetails.expiryDate,
        cvv: cardDetails.cvv
      };

      const response = await processPayment(paymentData);
      alert("Payment successful! Transaction ID: " + response.transactionID);
      onPaymentSuccess();
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handlePayment}>
      <h2>Payment Details</h2>
      
      <div className="form-group">
        <label>Card Holder Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={cardDetails.cardHolder}
          onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardDetails.cardNumber}
          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={cardDetails.expiryDate}
            onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>CVV</label>
          <input
            type="text"
            placeholder="123"
            value={cardDetails.cvv}
            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="total-amount">
        <strong>Total Amount: ₹{totalPrice}</strong>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default PaymentForm;
