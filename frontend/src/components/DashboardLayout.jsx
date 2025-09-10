import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAllergies, faPills, faSyringe, faHeartbeat, faStethoscope, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import './DashboardLayout.css';

const navLinks = [
    { to: '/dashboard/allergies', icon: faAllergies, text: 'Allergies' },
    { to: '/dashboard/medications', icon: faPills, text: 'Medications' },
    { to: '/dashboard/vaccinations', icon: faSyringe, text: 'Vaccinations' },
    { to: '/dashboard/vitals', icon: faHeartbeat, text: 'Vitals' },
    { to: '/dashboard/history', icon: faStethoscope, text: 'Medical History' },
    { to: '/dashboard/custom', icon: faPlusSquare, text: 'Custom Sections' }
];

const DashboardLayout = () => {
    return (
        <div className="container dashboard-layout">
            <aside className="dashboard-nav">
                <nav>
                    <ul className="dashboard-nav-list">
                        {navLinks.map(link => (
                            <li key={link.to}>
                                <NavLink to={link.to} className="dashboard-nav-link">
                                    <FontAwesomeIcon icon={link.icon} className="nav-icon" />
                                    <span>{link.text}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className="dashboard-content">
                {/* Child routes will be rendered here */}
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;