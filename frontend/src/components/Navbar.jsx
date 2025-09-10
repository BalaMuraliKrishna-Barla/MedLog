import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api'; // Import api service
import toast from 'react-hot-toast'; // Import toast
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faFilePdf, faFileCode } from '@fortawesome/free-solid-svg-icons';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownload = async (format) => {
    const toastId = toast.loading(`Generating ${format.toUpperCase()} report...`);
    try {
        if (format === 'pdf') {
            const blob = await api.exportPdf();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `MedLog_Report_${user.name}.pdf`;
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else if (format === 'json') {
            const data = await api.exportJson();
            const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
            const a = document.createElement('a');
            a.href = jsonString;
            a.download = `MedLog_Backup_${user.name}.json`;
            a.click();
        }
        toast.success(`${format.toUpperCase()} downloaded successfully!`, { id: toastId });
    } catch (error) {
        toast.error(`Failed to download ${format.toUpperCase()} report. ${error.message}`, { id: toastId });
    }
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
                <li className="nav__item">
                  <NavLink to="/appointments" className="nav__link">Appointments</NavLink>
                </li>
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
              <div className="nav__dropdown">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="nav__dropdown-toggle btn">
                    Export Data
                </button>
                {isDropdownOpen && (
                    <ul className="nav__dropdown-menu">
                        <li onClick={() => handleDownload('pdf')}>
                            <FontAwesomeIcon icon={faFilePdf} /> PDF Summary
                        </li>
                        <li onClick={() => handleDownload('json')}>
                            <FontAwesomeIcon icon={faFileCode} /> JSON Backup
                        </li>
                    </ul>
                )}
              </div>

              <Link to="/profile" className="nav__user-profile">
                <FontAwesomeIcon icon={faUserCircle} className="nav__user-icon" />
                <span>{user?.name}</span>
              </Link>
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