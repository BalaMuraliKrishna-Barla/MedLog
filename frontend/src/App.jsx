import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core Components & Context
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './context/DataContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

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
  const { isAuthenticated, isLoading } = useAuth();
  // Show a global loading indicator while the authentication state is being verified.
  // This prevents a logged-in user from briefly seeing a public page on refresh.
  if (isLoading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <h1>Loading...</h1>
    </div>
    );
  }
  return (
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, paddingTop: '4.5rem' }} className="fade-in">
          <Routes>
            {/* Public Routes: Redirect to dashboard if user is already authenticated */}
            <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
            {/* Protected Routes: These are handled by the ProtectedRoute component */}
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