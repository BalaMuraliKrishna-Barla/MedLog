// REPLACE the entire frontend/src/pages/AppointmentsPage.jsx file

import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import Modal from '../components/Modal';
import ConfirmationModal from '../components/ConfirmationModal';
import AppointmentForm from '../components/AppointmentForm';
import Spinner from '../components/Spinner';
import * as api from '../services/api';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const { records, loading, error, deleteRecord } = useData();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  const openFormModal = (appointment = null) => {
    setSelectedAppointment(appointment);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedAppointment(null);
  };

  const openConfirmModal = (id) => {
    setItemToDelete(id);
    setIsConfirmModalOpen(true);
  };
  
  const closeConfirmModal = () => {
    setItemToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
        await api.deleteAppointment(itemToDelete);
        deleteRecord('appointments', itemToDelete);
        toast.success('Appointment removed.');
    } catch (err) {
        toast.error(err.message || 'Failed to delete appointment.');
    } finally {
        closeConfirmModal();
    }
  };

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    // Sort all appointments first, then partition them
    const sortedAppointments = [...records.appointments].sort((a, b) => 
        new Date(a.appointmentDateTime) - new Date(b.appointmentDateTime)
    );

    const upcoming = sortedAppointments.filter(app => new Date(app.appointmentDateTime) >= now);
    const past = sortedAppointments.filter(app => new Date(app.appointmentDateTime) < now).reverse(); // Show most recent past first
    
    return { upcoming, past };
  }, [records.appointments]);

  if (loading) return <Spinner />;
  if (error) return <div className="container error-message">{error}</div>;

  const renderAppointment = (app) => (
    <div key={app._id} className="appointment-item record-item"> {/* Re-use record-item class */}
      <div className="appointment-details record-details">
        <h4>{app.purpose} with {app.doctorName}</h4>
        <p><strong>When:</strong> {new Date(app.appointmentDateTime).toLocaleString()}</p>
        <p><strong>Where:</strong> {app.location || 'No location specified'}</p>
      </div>
      <div className="appointment-actions record-actions">
        <button onClick={() => openFormModal(app)} className="btn-edit">Edit</button>
        <button onClick={() => openConfirmModal(app._id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <Card title="My Appointments" onAdd={() => openFormModal()} icon={<FontAwesomeIcon icon={faCalendarCheck} color="#1976D2"/>}>
        <div className="appointments-list">
          <h3 className="list-subtitle">Upcoming</h3>
          {upcoming.length > 0 ? upcoming.map(renderAppointment) : <p className="no-records">No upcoming appointments.</p>}
        </div>
        <div className="appointments-list">
          <h3 className="list-subtitle">Past</h3>
          {past.length > 0 ? past.map(renderAppointment) : <p className="no-records">No past appointments.</p>}
        </div>
      </Card>

      <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={selectedAppointment ? 'Edit Appointment' : 'Add New Appointment'}>
        <AppointmentForm existingAppointment={selectedAppointment} onFormSubmit={closeFormModal} />
      </Modal>

      <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={closeConfirmModal}
          onConfirm={handleDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this appointment?"
      />
    </div>
  );
};

export default AppointmentsPage;