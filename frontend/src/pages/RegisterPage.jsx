import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyAndRegister } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faCalendarDay, faKey } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import '../styles/Auth.css';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.07, duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};


const RegisterPage = () => {
    const [step, setStep] = useState(1); // 1 for details, 2 for OTP
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', dateOfBirth: '', role: 'Patient',
    });
    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const validateDetails = () => {
        const newErrors = {};
        if (!/^[a-zA-Z\s]+$/.test(formData.name)) newErrors.name = 'Name must contain only letters and spaces.';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email address is invalid.';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long.';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
        else if (new Date(formData.dateOfBirth) > new Date()) newErrors.dateOfBirth = 'Date of birth cannot be in the future.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validateDetails()) return;
        
        setLoading(true);
        const toastId = toast.loading('Sending verification code...');
        try {
            await sendOtp(formData.email);
            toast.success('Verification code sent to your email!', { id: toastId });
            setStep(2); // Move to OTP step
        } catch (err) {
            setApiError(err.message || 'Failed to send OTP. This email might already be in use.');
            toast.error(err.message || 'Failed to send OTP.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setApiError('');
        if (otp.length !== 6) {
            setApiError('Please enter the 6-digit OTP.');
            return;
        }
        setLoading(true);
        const toastId = toast.loading('Verifying and creating account...');
        try {
            const finalUserData = { ...formData, otp };
            const data = await verifyAndRegister(finalUserData);
            toast.success('Account created successfully!', { id: toastId });
            login(data, data.token);
            navigate('/dashboard');
        } catch (err) {
            setApiError(err.message || 'Registration failed. The OTP may be incorrect or expired.');
            toast.error(err.message || 'Registration failed.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="auth-container">
            <motion.div className="auth-card" initial={{ height: 'auto' }} animate={{ height: 'auto' }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.h1 variants={itemVariants} className="auth-title">Create Your Account</motion.h1>
                            <motion.p variants={itemVariants} className="auth-subtitle">Join MedLog today to manage your health.</motion.p>
                            <motion.form variants={containerVariants} className="auth-form" onSubmit={handleSendOtp}>
                                {/* All form fields from your original component */}
                                <motion.div variants={itemVariants} className="input-group"><label>Full Name<span className="required-star">*</span></label><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={errors.name ? 'invalid' : ''} /><FontAwesomeIcon icon={faUser} className="input-icon" />{errors.name && <span className="error-text">{errors.name}</span>}</motion.div>
                                <motion.div variants={itemVariants} className="input-group"><label>Email Address<span className="required-star">*</span></label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className={errors.email ? 'invalid' : ''} /><FontAwesomeIcon icon={faEnvelope} className="input-icon" />{errors.email && <span className="error-text">{errors.email}</span>}</motion.div>
                                <motion.div variants={itemVariants} className="input-group"><label>Password<span className="required-star">*</span></label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" className={errors.password ? 'invalid' : ''} /><FontAwesomeIcon icon={faLock} className="input-icon" />{errors.password && <span className="error-text">{errors.password}</span>}</motion.div>
                                <motion.div variants={itemVariants} className="input-group"><label>Date of Birth<span className="required-star">*</span></label><input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? 'invalid' : ''} /><FontAwesomeIcon icon={faCalendarDay} className="input-icon" style={{transform: 'translateY(0%)'}} />{errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}</motion.div>
                                <motion.div variants={itemVariants} className="input-group"><label>I am a...<span className="required-star">*</span></label><select name="role" value={formData.role} onChange={handleChange}><option value="Patient">Patient</option><option value="Doctor">Doctor</option></select></motion.div>
                                {apiError && <motion.div variants={itemVariants} className="error-message">{apiError}</motion.div>}
                                <motion.button variants={itemVariants} type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending Code...' : 'Continue'}</motion.button>
                            </motion.form>
                            <motion.div variants={itemVariants} className="auth-footer"><p>Already have an account? <Link to="/login">Sign In</Link></p></motion.div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.h1 variants={itemVariants} className="auth-title">Verify Your Email</motion.h1>
                            <motion.p variants={itemVariants} className="auth-subtitle">Enter the 6-digit code sent to <strong>{formData.email}</strong></motion.p>
                            <motion.form variants={containerVariants} className="auth-form" onSubmit={handleVerifyAndRegister}>
                                <motion.div variants={itemVariants} className="input-group">
                                    <label htmlFor="otp">Verification Code<span className="required-star">*</span></label>
                                    <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" maxLength="6" />
                                    <FontAwesomeIcon icon={faKey} className="input-icon" />
                                </motion.div>
                                {apiError && <motion.div variants={itemVariants} className="error-message">{apiError}</motion.div>}
                                <motion.button variants={itemVariants} type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Verifying...' : 'Create Account'}</motion.button>
                            </motion.form>
                            <motion.div variants={itemVariants} className="auth-footer">
                                <p>Didn't receive a code? <a href="#" onClick={(e) => { e.preventDefault(); setStep(1); setApiError(''); }}>Go Back and try again</a></p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default RegisterPage;