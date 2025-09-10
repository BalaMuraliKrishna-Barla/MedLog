import React, { useState } from 'react';
import AllergySection from '../components/AllergySection';
import MedicationSection from '../components/MedicationSection';
import VaccinationSection from '../components/VaccinationSection';
import PendingGrants from '../components/PendingGrants';
import PatientList from '../components/PatientList';
import { useData } from '../context/DataContext';
import Spinner from '../components/Spinner';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const { loading, error } = useData();
  // We need a key to force re-render of PatientList when a grant is accepted
  const [patientListKey, setPatientListKey] = useState(0);

  const handleGrantUpdate = () => {
    setPatientListKey(prevKey => prevKey + 1);
  };

  if (loading) {
    return <div className="container"><Spinner /></div>;
  }
  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container container">
      {/* Doctor-specific components */}
      <PendingGrants onGrantUpdate={handleGrantUpdate} />
      <PatientList key={patientListKey} />

      {/* Patient's personal health record */}
      <h1 className="dashboard-title">My Health Dashboard</h1>
      <div className="dashboard-grid">
        <AllergySection />
        <MedicationSection />
        <VaccinationSection />
        {/* <VitalSection /> */}
        {/* <MedicalEventSection /> */}
      </div>
    </div>
  );
};

export default DashboardPage;

