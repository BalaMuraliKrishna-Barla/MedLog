import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Core Components & Context
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './context/DataContext';
import { useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import SharingPage from './pages/SharingPage';
import PatientRecordPage from './pages/PatientRecordPage';
import DashboardLayout from './components/DashboardLayout';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import HomePage from './pages/HomePage';
import CustomSectionsPage from './pages/CustomSectionsPage';


// Placeholder Pages
const NotFoundPage = () => <div className="container" style={{ paddingTop: '5rem' }}><h1>404 - Not Found</h1></div>;

// THIS IS THE MISSING COMPONENT DEFINITION
// It acts as a router to show the correct dashboard based on user role.
const Dashboard = () => {
    const { user } = useAuth();
    if (user.role === 'Doctor') {
        return <DoctorDashboardPage />;
    }
    // For Patients, DashboardLayout handles the nested routes via its <Outlet />
    return <DashboardLayout />;
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
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
          <main style={{ flex: 1, paddingTop: 'calc(4.5rem + var(--sp-2))', paddingBottom: 'var(--sp-2)' }} className="fade-in">          <Routes>
            {/* Public Routes */}
            <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />

            {/* Main Dashboard Route using a wildcard */}
            <Route 
                path="/dashboard/*"
                element={
                    <ProtectedRoute>
                        <DataProvider>
                            {/* This inner Routes block handles the logic for /dashboard */}
                            <Routes>
                                {/* The parent route uses the Dashboard component to decide which layout to show */}
                                <Route path="/" element={<Dashboard />}>
                                    {/* These routes are ONLY for Patients and render inside DashboardLayout's <Outlet> */}
                                    <Route index element={<Navigate to="allergies" replace />} />
                                    <Route path="allergies" element={<DashboardPage />} />
                                    <Route path="medications" element={<DashboardPage />} />
                                    <Route path="vaccinations" element={<DashboardPage />} />
                                    <Route path="vitals" element={<DashboardPage />} />
                                    <Route path="history" element={<DashboardPage />} />
                                    <Route path="custom" element={<CustomSectionsPage />} />
                                </Route>
                            </Routes>
                        </DataProvider>
                    </ProtectedRoute>
                }
            />
            
            {/* Other Top-Level Protected Routes */}
            <Route path="/appointments" element={<ProtectedRoute><DataProvider><AppointmentsPage /></DataProvider></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DataProvider><ProfilePage /></DataProvider></ProtectedRoute>} />
            <Route path="/sharing" element={<ProtectedRoute><SharingPage /></ProtectedRoute>} />
            <Route path="/records/:userId" element={<ProtectedRoute><DataProvider><PatientRecordPage /></DataProvider></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;