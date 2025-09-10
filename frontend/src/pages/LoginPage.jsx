import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // Import motion
import '../styles/Auth.css';

// Define animation variants outside the component
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.1, duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LoginPage = () => {
  // --- ALL EXISTING LOGIC IS UNCHANGED ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
        setError('Please enter both email and password.');
        return;
    }
    
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      login(data, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  // --- END OF UNCHANGED LOGIC ---

  return (
    <div className="auth-container">
      {/* Wrap the card and its children with motion components */}
      <motion.div 
        className="auth-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="auth-title">Welcome Back</motion.h1>
        <motion.p variants={itemVariants} className="auth-subtitle">Sign in to access your health records.</motion.p>
        
        <motion.form variants={itemVariants} className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address<span className="required-star">*</span></label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required 
            />
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password<span className="required-star">*</span></label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
            <FontAwesomeIcon icon={faLock} className="input-icon" />
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </motion.form>
        
        <motion.div variants={itemVariants} className="auth-footer">
          <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;