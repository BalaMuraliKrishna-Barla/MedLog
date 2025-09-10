import React from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Spinner from '../components/Spinner';
import AllergySection from '../components/AllergySection';
import MedicationSection from '../components/MedicationSection';
import VaccinationSection from '../components/VaccinationSection';
import VitalSection from '../components/VitalSection';
import MedicalEventSection from '../components/MedicalEventSection';

const DashboardPage = () => {
    const { records, loading, error } = useData();
    const location = useLocation();
    const path = location.pathname;

    if (loading) return <Spinner />;
    if (error) return <div className="error-message">{error}</div>;

    // Render the appropriate section based on the URL path
    if (path.includes('allergies')) {
        return <AllergySection allergies={records.allergies} />;
    }
    if (path.includes('medications')) {
        return <MedicationSection medications={records.medications} />;
    }
    if (path.includes('vaccinations')) {
        return <VaccinationSection vaccinations={records.vaccinations} />;
    }
    if (path.includes('vitals')) {
        return <VitalSection vitals={records.vitals} />;
    }
    if (path.includes('history')) {
        return <MedicalEventSection medicalEvents={records.medicalEvents} />;
    }

    // Fallback if no specific section is matched
    return <h2>Select a category from the left menu to view your records.</h2>;
};

export default DashboardPage;