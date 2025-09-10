import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartPulse, faLock, faShareAlt, faFilePdf, faUserMd, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // Import motion
import './HomePage.css';

// Animation variants for sections
const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// Animation variants for individual feature cards
const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

const HomePage = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content container">
                    <motion.h1 
                        className="hero-title"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Your Health Story, All in One Place.
                    </motion.h1>
                    <motion.p 
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        MedLog empowers you to securely manage your medical records, track your health journey, and share information with your doctors, anytime and anywhere.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        {/* Apply the new btn-hero class here */}
                        <Link to="/register" className="btn btn-lg btn-hero">Create Your Free Account</Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <motion.section 
                className="features-section container"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="section-title">A Central Hub for Your Health</h2>
                <p className="section-subtitle">Effortlessly manage every aspect of your medical life.</p>
                <div className="features-grid">
                    <motion.div className="feature-card" variants={cardVariants}><FontAwesomeIcon icon={faClipboardList} className="feature-icon" /><h3>Comprehensive Records</h3><p>Track allergies, medications, vaccinations, vitals, and appointments with dedicated, easy-to-use forms.</p></motion.div>
                    <motion.div className="feature-card" variants={cardVariants}><FontAwesomeIcon icon={faLock} className="feature-icon" /><h3>Secure & Private</h3><p>Your data is your own. We prioritize security to ensure your sensitive health information remains confidential.</p></motion.div>
                    <motion.div className="feature-card" variants={cardVariants}><FontAwesomeIcon icon={faShareAlt} className="feature-icon" /><h3>Controlled Sharing</h3><p>Grant secure, read-only access to your doctors or family members. You control who sees your data and can revoke access anytime.</p></motion.div>
                    <motion.div className="feature-card" variants={cardVariants}><FontAwesomeIcon icon={faFilePdf} className="feature-icon" /><h3>Data Portability</h3><p>Export your complete health summary as a professional PDF or a full JSON backup for your personal records.</p></motion.div>
                    <motion.div className="feature-card" variants={cardVariants}><FontAwesomeIcon icon={faUserMd} className="feature-icon" /><h3>For Patients & Doctors</h3><p>Designed for individuals to manage their health and for doctors to easily view the records of patients who grant them access.</p></motion.div>
                    <motion.div className="feature-card" variants={cardVariants}><FontAwesomeIcon icon={faHeartPulse} className="feature-icon" /><h3>Custom Tracking</h3><p>Create your own sections to track anything that matters to you, like symptoms, therapy notes, or fitness progress.</p></motion.div>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <motion.section 
                className="how-it-works-section"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container">
                    <h2 className="section-title">Get Started in 3 Simple Steps</h2>
                    <div className="steps-grid">
                        <motion.div className="step-card" variants={cardVariants}><div className="step-number">1</div><h3>Create Your Account</h3><p>Sign up in seconds as a patient or a doctor. It's completely free.</p></motion.div>
                        <motion.div className="step-card" variants={cardVariants}><div className="step-number">2</div><h3>Add Your Records</h3><p>Easily input your health information using our guided forms for every category.</p></motion.div>
                        <motion.div className="step-card" variants={cardVariants}><div className="step-number">3</div><h3>Manage & Share</h3><p>Your health dashboard is ready. Keep it updated and share it with your doctor when needed.</p></motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Call to Action Section */}
            <motion.section 
                className="cta-section"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="container">
                    <h2>Take Control of Your Health Today</h2>
                    <p>Join thousands of users who are simplifying their medical lives with MedLog.</p>
                    <Link to="/register" className="btn btn-primary btn-lg">Get Started Now</Link>
                </div>
            </motion.section>
        </div>
    );
};

export default HomePage;