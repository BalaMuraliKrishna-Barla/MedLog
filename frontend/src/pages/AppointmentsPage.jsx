import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import Card from '../components/Card';
import Modal from '../components/Modal';
import AppointmentForm from '../components/AppointmentForm';
import Spinner from '../components/Spinner';
import * as api from '../services/api';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const { records, loading, error, deleteRecord } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const openModal = (appointment = null) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
        try {
            await api.deleteAppointment(id);
            deleteRecord('appointments', id);
        } catch (err) {
            alert(err.message || 'Failed to delete appointment.');
        }
    }
  };

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const upcoming = [];
    const past = [];
    records.appointments.forEach(app => {
        if (new Date(app.appointmentDateTime) >= now) {
            upcoming.push(app);
        } else {
            past.push(app);
        }
    });
    return { upcoming, past };
  }, [records.appointments]);

  if (loading) return <Spinner />;
  if (error) return <div className="container error-message">{error}</div>;

  const renderAppointment = (app) => (
    <div key={app._id} className="appointment-item">
      <div className="appointment-details">
        <h4>{app.purpose} with {app.doctorName}</h4>
        <p>{new Date(app.appointmentDateTime).toLocaleString()}</p>
        <p>{app.location || 'No location specified'}</p>
      </div>
      <div className="appointment-actions">
        <button onClick={() => openModal(app)} className="btn-edit">Edit</button>
        <button onClick={() => handleDelete(app._id)} className="btn-delete">Delete</button>
      </div>
    </div>
  );

  return (
    <div className="container">
      <Card title="My Appointments" onAdd={() => openModal()}>
        <div className="appointments-list">
          <h3>Upcoming</h3>
          {upcoming.length > 0 ? upcoming.map(renderAppointment) : <p>No upcoming appointments.</p>}
        </div>
        <div className="appointments-list">
          <h3>Past</h3>
          {past.length > 0 ? past.map(renderAppointment) : <p>No past appointments.</p>}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedAppointment ? 'Edit Appointment' : 'Add New Appointment'}>
        <AppointmentForm existingAppointment={selectedAppointment} onFormSubmit={closeModal} />
      </Modal>
    </div>
  );
};

export default AppointmentsPage;