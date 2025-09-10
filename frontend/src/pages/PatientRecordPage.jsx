import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as api from '../services/api';
import Spinner from '../components/Spinner';
import AllergySection from '../components/AllergySection';
import MedicationSection from '../components/MedicationSection';
import VaccinationSection from '../components/VaccinationSection';
import VitalSection from '../components/VitalSection';
import MedicalEventSection from '../components/MedicalEventSection';
import CustomSection from '../components/CustomSection'; // Assuming it can be read-only too
import '../styles/Dashboard.css';

const PatientRecordPage = () => {
    const { userId } = useParams();
    const [patientName, setPatientName] = useState('');
    const [records, setRecords] = useState({
        allergies: [], medications: [], vaccinations: [], vitals: [], medicalEvents: [], customSections: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatientData = async () => {
            setLoading(true);
            setError('');
            try {
                // Fetch all data in parallel
                const [
                    userData,
                    allergies,
                    medications,
                    vaccinations,
                    vitals,
                    medicalEvents,
                    customSections
                ] = await Promise.all([
                    api.getUserById(userId),
                    api.getAllergies(userId),
                    api.getMedications(userId),
                    api.getVaccinations(userId),
                    api.getVitals(userId),
                    api.getMedicalEvents(userId),
                    api.getCustomSections(userId)
                ]);

                setPatientName(userData.name);
                setRecords({
                    allergies,
                    medications,
                    vaccinations,
                    vitals,
                    medicalEvents,
                    customSections
                });

            } catch (err) {
                setError(err.message || 'Could not fetch patient records.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchPatientData();
        }
    }, [userId]);

    if (loading) return <div className="container"><Spinner /></div>;
    if (error) return <div className="container error-message">{error}</div>;

    return (
        <div className="dashboard-container container">
            <h1 className="dashboard-title">Viewing Health Records for: {patientName}</h1>
            <p style={{ textAlign: "center", marginBottom: "2rem", color: 'var(--secondary-color)' }}>
                This is a read-only view. No changes can be made.
            </p>
            <div className="dashboard-grid">
                <AllergySection allergies={records.allergies} readOnly={true} />
                <MedicationSection medications={records.medications} readOnly={true} />
                <VaccinationSection vaccinations={records.vaccinations} readOnly={true} />
                <VitalSection vitals={records.vitals} readOnly={true} />
                <MedicalEventSection medicalEvents={records.medicalEvents} readOnly={true} />
                {records.customSections.map(section => (
                    <CustomSection key={section._id} section={section} readOnly={true} />
                ))}
            </div>
        </div>
    );
};

export default PatientRecordPage;