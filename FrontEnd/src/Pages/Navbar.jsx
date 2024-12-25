import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/navbar.css";

const Navbar = () => {
  const location = useLocation();

  // Function to add the 'active' class to the correct link
  const isActive = (path) => {
    return location.pathname === path ? "nav-link active-link" : "nav-link";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-custom mb-5 ">
      <div className="container-fluid">
        {/* Logo Section */}
        <Link className="navbar-brand" to="/">
          <img
            src="/path-to-logo.png" // Replace with the actual path to your logo
            alt="Logo"
            className="navbar-logo"
          />
        </Link>

        {/* Title */}
        <span className="navbar-title  d-none d-md-inline-block">
          Publications Division Exports Register
        </span>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={isActive("/")} to="/">
                Main
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/update")} to="/update">
                Update Data
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/fetch")} to="/fetch">
                Fetch Data
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/balance")} to="/balance">
                Check Balance
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
