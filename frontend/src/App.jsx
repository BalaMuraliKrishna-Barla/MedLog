import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- ALL YOUR ORIGINAL IMPORTS ARE PRESERVED ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './context/DataContext';
import { useAuth } from './context/AuthContext';
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

const NotFoundPage = () => <div className="container" style={{ paddingTop: '5rem' }}><h1>404 - Not Found</h1></div>;

const Dashboard = () => {
    const { user } = useAuth();
    if (user.role === 'Doctor') return <DoctorDashboardPage />;
    return <DashboardLayout />;
};

// This new component contains only the Routes and Animation logic.
// All business logic remains in the main App component.
const AnimatedRoutes = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth(); // We need this to keep the routing logic the same

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Routes location={location}>
                    {/* --- ALL YOUR ORIGINAL ROUTES AND LOGIC ARE PRESERVED --- */}
                    <Route path="/" element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" />} />
                    <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />

                    <Route path="/dashboard/*" element={
                        <ProtectedRoute>
                            <DataProvider>
                                <Routes>
                                    <Route path="/" element={<Dashboard />}>
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
                    }/>
                    
                    <Route path="/appointments" element={<ProtectedRoute><DataProvider><AppointmentsPage /></DataProvider></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><DataProvider><ProfilePage /></DataProvider></ProtectedRoute>} />
                    <Route path="/sharing" element={<ProtectedRoute><SharingPage /></ProtectedRoute>} />
                    <Route path="/records/:userId" element={<ProtectedRoute><DataProvider><PatientRecordPage /></DataProvider></ProtectedRoute>} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

// The main App component's structure and logic is preserved.
function App() {
  const { isLoading } = useAuth();
  
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
        <main style={{ flex: 1, paddingTop: 'calc(4.5rem + var(--sp-2))', paddingBottom: 'var(--sp-2)' }} className="fade-in">
           <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;