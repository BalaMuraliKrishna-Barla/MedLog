// REPLACE the entire file with this new version
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

import AllergySection from '../components/AllergySection';
import MedicationSection from '../components/MedicationSection';
import VaccinationSection from '../components/VaccinationSection';
import VitalSection from '../components/VitalSection';
import MedicalEventSection from '../components/MedicalEventSection';
import CustomSection from '../components/CustomSection';
import CustomSectionForm from '../components/CustomSectionForm';

import PendingGrants from '../components/PendingGrants';
import PatientList from '../components/PatientList';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import '../styles/Dashboard.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const { records, loading, error } = useData();
  const [patientListKey, setPatientListKey] = useState(0);
  const [isCustomSectionModalOpen, setIsCustomSectionModalOpen] = useState(false);

  const handleGrantUpdate = () => {
    setPatientListKey(prevKey => prevKey + 1);
  };

  if (loading || !user) {
    return <div className="container"><Spinner /></div>;
  }
  
  if (error) {
    return <div className="container error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container container">
      {user.role === 'Patient' && (
        <>
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Health Dashboard</h1>
            <button className="btn btn-secondary" onClick={() => setIsCustomSectionModalOpen(true)}>+ Add Custom Section</button>
          </div>
          <div className="dashboard-grid">
            <AllergySection />
            <MedicationSection />
            <VaccinationSection />
            <VitalSection />
            <MedicalEventSection />
            {records.customSections.map(section => (
                <CustomSection key={section._id} section={section} />
            ))}
          </div>
          <Modal isOpen={isCustomSectionModalOpen} onClose={() => setIsCustomSectionModalOpen(false)} title="Create New Section">
                <CustomSectionForm onFormSubmit={() => setIsCustomSectionModalOpen(false)} />
          </Modal>
        </>
      )}

      {user.role === 'Doctor' && (
        <>
          <h1 className="dashboard-title">Doctor Dashboard</h1>
          <PendingGrants onGrantUpdate={handleGrantUpdate} />
          <PatientList key={patientListKey} />
        </>
      )}
    </div>
  );
};

export default DashboardPage;