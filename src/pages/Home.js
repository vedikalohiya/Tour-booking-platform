import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* HERO SECTION */}
      <div className="hero">
        <div className="overlay">
          <h1>Explore The World With GT Holidays</h1>
          <p>Luxury Travel | Best Deals | Trusted by Thousands</p>
          <button onClick={() => navigate("/packages")}>
            Explore Packages
          </button>
        </div>
      </div>

      <div className="features">

  <div className="feature">
    <h3>🌍 Worldwide Tours</h3>
    <p>Explore destinations across the globe</p>
  </div>

  <div className="feature">
    <h3>💰 Best Price Guarantee</h3>
    <p>Affordable luxury travel packages</p>
  </div>

  <div className="feature">
    <h3>⭐ Top Rated Service</h3>
    <p>Thousands of happy customers</p>
  </div>

</div>

      {/* CTA SECTION */}
      <div className="cta">
        <h2>Ready for your next trip?</h2>
        <button onClick={() => navigate("/packages")}>
          Book Now
        </button>
      </div>

    </div>
  );
}

export default Home;