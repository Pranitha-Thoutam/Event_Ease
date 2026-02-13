import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ isAuthenticated, isAdmin, handleAuthChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // This useEffect is now only for initial setup if needed, or can be removed if handleAuthChange covers everything
    // The props isAuthenticated and isAdmin will directly control rendering
  }, [isAuthenticated, isAdmin]); // Depend on props

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); // Remove user object
    localStorage.removeItem('userRole');
    handleAuthChange(); // Notify App.js of auth change
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMenuOpen(false)}>
          EventEase
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/events" className="nav-link" onClick={toggleMenu}>
              Events
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/my-bookings" className="nav-link" onClick={toggleMenu}>
                  My Bookings
                </Link>
              </li>
              {isAdmin && (
                <>
                  <li className="nav-item">
                    <Link to="/admin/dashboard" className="nav-link" onClick={toggleMenu}>
                      Admin Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/add-event" className="nav-link" onClick={toggleMenu}>
                      Add Event
                    </Link>
                  </li>
                </>
              )}
            </>
          )}
          <li className="nav-item">
            <Link to="/about" className="nav-link" onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
          {/* Authentication buttons appear here only in mobile menu */}
          {isMenuOpen && !isAuthenticated && (
            <li className="nav-item">
              <Link to="/login" className="nav-button login mobile-only" onClick={toggleMenu}>
                Login
              </Link>
            </li>
          )}
          {isMenuOpen && !isAuthenticated && (
            <li className="nav-item">
              <Link to="/signup" className="nav-button signup mobile-only" onClick={toggleMenu}>
                Sign Up
              </Link>
            </li>
          )}
          {isMenuOpen && isAuthenticated && (
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-button logout mobile-only">
                Logout
              </button>
            </li>
          )}
        </ul>

        {/* Authentication buttons appear here only on desktop */}
        <div className="nav-buttons desktop-only">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="nav-button logout">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="nav-button login">
                Login
              </Link>
              <Link to="/signup" className="nav-button signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
