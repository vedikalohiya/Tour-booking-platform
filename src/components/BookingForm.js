import { useState, useEffect } from "react";
import { createBooking } from "../api/apiClient";

const BASE_URL = "https://fbk7tgys17.execute-api.ap-south-1.amazonaws.com/dev";

function BookingForm({ selectedPackage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    adults: 1,
    children: 0,
    tripDate: "",
    tripId: "",
    totalPrice: 0
  });

const [loading, setLoading] = useState(false);
const [trips, setTrips] = useState([]);
const [showSuccess, setShowSuccess] = useState(false);

  // ==========================
  // FETCH TRIPS FROM DYNAMODB
  // ==========================
  useEffect(() => {
    if (!selectedPackage?.packageId) return;

    fetch(`${BASE_URL}/reservation`)
      .then((res) => res.json())
      .then((data) => {
        console.log("RAW API:", data);

        let tripsArray = data;

        // API Gateway response handling
        if (data.body) {
          tripsArray =
            typeof data.body === "string"
              ? JSON.parse(data.body)
              : data.body;
        }

        console.log("Parsed Trips:", tripsArray);

        // Normalize data
        const cleanTrips = tripsArray.map((trip) => ({
          TripID: trip.TripID,
          PackageID: trip.PackageID,
          Date: trip.Date,
          Seats: Number(trip.Seats)
        }));

        console.log("Clean Trips:", cleanTrips);
        console.log("Selected Package ID:", selectedPackage.packageId);

        // Match package
        const filteredTrips = cleanTrips.filter(
          (trip) =>
            String(trip.PackageID).trim() ===
            String(selectedPackage.packageId).trim()
        );

        console.log("Filtered Trips:", filteredTrips);

        setTrips(filteredTrips);
      })
      .catch((err) => {
        console.error("Trip Fetch Error:", err);
      });
  }, [selectedPackage]);

  // ==========================
  // AUTO PRICE CALCULATION
  // ==========================
  useEffect(() => {
    const adults = Number(form.adults || 0);
    const children = Number(form.children || 0);
    const price = Number(selectedPackage?.price || 0);

    const total = (adults + children) * price;

    setForm((prev) => ({
      ...prev,
      totalPrice: total
    }));
  }, [form.adults, form.children, selectedPackage]);

  // ==========================
  // FORM SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (!form.tripDate) {
        alert("Please select trip date");
        setLoading(false);
        return;
      }

const bookingData = {

  PackageID: selectedPackage.packageId,

  PackageName: selectedPackage.name,

  TripID: form.tripId,

  Name: form.name,

  Email: form.email,

  Contact: form.contact,

  Adults: Number(form.adults),

  Children: Number(form.children),

  TripDate: form.tripDate,

  TotalPrice: Number(form.totalPrice)

};

      console.log("BOOKING PAYLOAD:", bookingData);

      const response = await createBooking(bookingData);

      console.log("Booking Success:", response);

      setShowSuccess(true);

      setForm({
        name: "",
        email: "",
        contact: "",
        adults: 1,
        children: 0,
        tripDate: "",
        tripId: "",
        totalPrice: 0
      });
    } catch (error) {
      console.error("BOOKING ERROR:", error);
      alert("❌ Booking Failed. Open console.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Package</label>
      <input value={selectedPackage?.name || ""} readOnly />

      <label>Price per person</label>
      <input value={`₹${selectedPackage?.price || 0}`} readOnly />

      <label>Full Name</label>
      <input
        type="text"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value
          })
        }
        required
      />

      <label>Email</label>
      <input
        type="email"
        value={form.email}
        onChange={(e) =>
          setForm({
            ...form,
            email: e.target.value
          })
        }
        required
      />

      <label>Contact</label>
      <input
        type="text"
        value={form.contact}
        onChange={(e) =>
          setForm({
            ...form,
            contact: e.target.value
          })
        }
        required
      />

      <label>Select Trip</label>
      <select
        value={form.tripDate}
        onChange={(e) => {
          const selectedTrip = trips.find(
            (trip) => trip.Date === e.target.value
          );

          setForm({
            ...form,
            tripDate: e.target.value,
            tripId: selectedTrip?.TripID || ""
          });
        }}
        required
      >
        <option value="">Select Trip</option>

        {trips.length > 0 ? (
          trips.map((trip) => (
            <option key={trip.TripID} value={trip.Date}>
              {trip.Date} (Seats: {trip.Seats})
            </option>
          ))
        ) : (
          <option disabled>No Trips Available</option>
        )}
      </select>

      <label>Adults</label>
      <input
        type="number"
        min="1"
        value={form.adults}
        onChange={(e) =>
          setForm({
            ...form,
            adults: e.target.value
          })
        }
      />

      <label>Children</label>
      <input
        type="number"
        min="0"
        value={form.children}
        onChange={(e) =>
          setForm({
            ...form,
            children: e.target.value
          })
        }
      />

      <label>Total Price</label>
      <input value={`₹${form.totalPrice}`} readOnly />

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
      {showSuccess && (
  <div className="popup-overlay">
    <div className="success-popup">
      <h2>🎉 Booking Confirmed!</h2>
      <p>Thank you for booking with GT Holidays.</p>
      <p>We will contact you soon.</p>

      <button onClick={() => setShowSuccess(false)}>
        OK
      </button>
    </div>
  </div>
)}
    </form>
  );
}

export default BookingForm;
