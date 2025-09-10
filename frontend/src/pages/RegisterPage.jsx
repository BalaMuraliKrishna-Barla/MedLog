import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // Import motion
import '../styles/Auth.css';

// Define animation variants outside the component
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.07, duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const RegisterPage = () => {
    // --- ALL EXISTING LOGIC IS UNCHANGED ---
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
        if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            newErrors.name = 'Name must contain only letters and spaces.';
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
        }
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }
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
    // --- END OF UNCHANGED LOGIC ---

    return (
        <div className="auth-container">
            <motion.div 
                className="auth-card"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 variants={itemVariants} className="auth-title">Create Your Account</motion.h1>
                <motion.p variants={itemVariants} className="auth-subtitle">Join MedLog today to manage your health.</motion.p>

                <motion.form variants={containerVariants} className="auth-form" onSubmit={handleSubmit}>
                    <motion.div variants={itemVariants} className="input-group">
                        <label htmlFor="name">Full Name<span className="required-star">*</span></label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={errors.name ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faUser} className="input-icon" />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="input-group">
                        <label htmlFor="email">Email Address<span className="required-star">*</span></label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={errors.email ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="input-group">
                        <label htmlFor="password">Password<span className="required-star">*</span></label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className={errors.password ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="input-group">
                        <label htmlFor="dateOfBirth">Date of Birth<span className="required-star">*</span></label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? 'invalid' : ''} />
                        <FontAwesomeIcon icon={faCalendarDay} className="input-icon" style={{transform: 'translateY(0%)'}} />
                        {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="input-group">
                        <label htmlFor="role">I am a...<span className="required-star">*</span></label>
                        <select id="role" name="role" value={formData.role} onChange={handleChange}>
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                        </select>
                    </motion.div>

                    {apiError && <motion.div variants={itemVariants} className="error-message">{apiError}</motion.div>}
                    
                    <motion.button variants={itemVariants} type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </motion.button>
                </motion.form>
                
                <motion.div variants={itemVariants} className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;