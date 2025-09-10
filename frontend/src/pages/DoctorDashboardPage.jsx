import React, { useState } from 'react';
import PendingGrants from '../components/PendingGrants';
import PatientList from '../components/PatientList';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const DoctorDashboardPage = () => {
    const { user } = useAuth();
    // This key is used to force a re-render of the PatientList when an invite is accepted.
    const [patientListKey, setPatientListKey] = useState(Date.now());

    const handleGrantUpdate = () => {
        setPatientListKey(Date.now());
    };

    if (!user) {
        return <div className="container"><Spinner /></div>;
    }

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Doctor Dashboard</h1>
            <PendingGrants onGrantUpdate={handleGrantUpdate} />
            <PatientList key={patientListKey} />
        </div>
    );
};

export default DoctorDashboardPage;