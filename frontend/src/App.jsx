import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core Components & Context
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './context/DataContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import SharingPage from './pages/SharingPage';
import PatientRecordPage from './pages/PatientRecordPage';


// Placeholder Pages
import HomePage from './pages/HomePage';
const NotFoundPage = () => <div className="container" style={{ paddingTop: '5rem' }}><h1>404 - Not Found</h1></div>;

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1, paddingTop: '4.5rem' }} className="fade-in">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DataProvider><DashboardPage /></DataProvider></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><DataProvider><AppointmentsPage /></DataProvider></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DataProvider><ProfilePage /></DataProvider></ProtectedRoute>} />
            <Route path="/sharing" element={<ProtectedRoute><SharingPage /></ProtectedRoute>} />
            <Route path="/records/:userId" element={<ProtectedRoute><PatientRecordPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;