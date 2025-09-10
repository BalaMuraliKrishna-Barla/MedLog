import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
// We will reuse the section components but pass a `readOnly` prop
// This requires a small modification to the section components later

const PatientRecordPage = () => {
    const { userId } = useParams();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                // Fetch all data for the specific patient
                const [allergies, medications /*, other data types */] = await Promise.all([
                    api.getAllergies(userId),
                    api.getMedications(userId),
                    // Fetch other records here...
                ]);
                // We need the patient's name, which isn't in these records.
                // For a production app, you'd add an endpoint to get basic user info.
                // For now, we'll just show the ID.
                setPatientData({ allergies, medications, name: `Patient Records` });
            } catch (err) {
                setError(err.message || 'Could not fetch patient records.');
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [userId]);

    if (loading) return <Spinner />;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="dashboard-container container">
            <h1 className="dashboard-title">{patientData.name}</h1>
            <p style={{textAlign: "center", marginBottom: "2rem"}}>You are viewing these records in read-only mode.</p>
            <div className="dashboard-grid">
                {/* Here we would render read-only versions of our sections */}
                {/* For now, let's just display the raw data */}
                <pre>{JSON.stringify(patientData, null, 2)}</pre>
            </div>
        </div>
    );
};

export default PatientRecordPage;