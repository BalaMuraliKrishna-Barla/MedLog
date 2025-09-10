import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css'; // We will create this CSS file next

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav className="nav container">
        <Link to="/" className="nav__logo">MedLog</Link>
        <div className="nav__menu">
          <ul className="nav__list">
            {isAuthenticated && (
              <>
                <li className="nav__item">
                  <NavLink to="/dashboard" className="nav__link">Dashboard</NavLink>
                </li>
                {/* ADD THIS NEW LINK */}
                <li className="nav__item">
                  <NavLink to="/appointments" className="nav__link">Appointments</NavLink>
                </li>
                {/* ADD THIS NEW LINK */}
                <li className="nav__item">
                    <NavLink to="/sharing" className="nav__link">Sharing</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="nav__user-actions">
          {isAuthenticated ? (
            <>
              {/* ADD THIS NEW LINK TO PROFILE */}
              <Link to="/profile" className="nav__user-name">Welcome, {user?.name}</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;