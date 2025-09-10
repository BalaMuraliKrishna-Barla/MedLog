// REPLACE the entire frontend/src/pages/RegisterPage.jsx file

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCalendarDay, faUserMd } from '@fortawesome/free-solid-svg-icons';
import '../styles/Auth.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
        role: 'Patient',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const validate = () => {
        const newErrors = {};
        // Name validation: only letters and spaces
        if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            newErrors.name = 'Name must contain only letters and spaces.';
        }
        // Email validation
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        // Password validation
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
        // Date of Birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of birth is required.';
        } else if (new Date(formData.dateOfBirth) > new Date()) {
            newErrors.dateOfBirth = 'Date of birth cannot be in the future.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validate()) {
            return;
        }
        setLoading(true);
        try {
            const data = await registerUser(formData);
            login(data, data.token);
            navigate('/dashboard');
        } catch (err) {
            setApiError(err.message || 'Failed to register. The email might already be in use.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Create Your Account</h1>
                <p className="auth-subtitle">Join MedLog today to manage your health.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name">Full Name<span className="required-star">*</span></label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={errors.name ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email Address<span className="required-star">*</span></label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={errors.email ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Password<span className="required-star">*</span></label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className={errors.password ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="dateOfBirth">Date of Birth<span className="required-star">*</span></label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faCalendarDay} className="input-icon" style={{transform: 'translateY(0%)'}} />
                        {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="role">I am a...<span className="required-star">*</span></label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange}>
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                        </select>
                         {/* <FontAwesomeIcon icon={faUserMd} className="input-icon" style={{transform: 'translateY(0%)'}}/> */}
                    </div>

                    {apiError && <div className="error-message">{apiError}</div>}
                    
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;