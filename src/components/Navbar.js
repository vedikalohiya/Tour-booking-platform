import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>GT Holidays</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/packages">Packages</Link>
      </div>
    </nav>
  );
}

export default Navbar;