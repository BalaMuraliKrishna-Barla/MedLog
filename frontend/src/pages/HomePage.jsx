import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse, faLock, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Your Health, Your Records, Your Control.</h1>
                    <p className="hero-subtitle">
                        MedLog is a secure, personal health record system designed to empower you
                        to manage your medical information effortlessly.
                    </p>
                    <Link to="/register" className="btn btn-primary btn-lg">Get Started for Free</Link>
                </div>
            </section>

            <section className="features-section container">
                <h2 className="section-title">Why Choose MedLog?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <FontAwesomeIcon icon={faHeartPulse} className="feature-icon" />
                        <h3>Comprehensive Tracking</h3>
                        <p>Keep track of allergies, medications, appointments, and more, all in one place.</p>
                    </div>
                    <div className="feature-card">
                        <FontAwesomeIcon icon={faLock} className="feature-icon" />
                        <h3>Secure & Private</h3>
                        <p>Your data is encrypted and secure. You control who sees your information.</p>
                    </div>
                    <div className="feature-card">
                        <FontAwesomeIcon icon={faShareAlt} className="feature-icon" />
                        <h3>Easy Sharing</h3>
                        <p>Grant temporary, read-only access to your doctors or family members with a single click.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
