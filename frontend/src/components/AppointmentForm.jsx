import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const AppointmentForm = ({ existingAppointment, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    doctorName: '', specialty: '', purpose: '', appointmentDateTime: '', location: '', notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addRecord, updateRecord } = useData();

  useEffect(() => {
    if (existingAppointment) {
      setFormData({
        doctorName: existingAppointment.doctorName,
        specialty: existingAppointment.specialty || '',
        purpose: existingAppointment.purpose,
        appointmentDateTime: new Date(existingAppointment.appointmentDateTime).toISOString().slice(0, 16),
        location: existingAppointment.location || '',
        notes: existingAppointment.notes || ''
      });
    }
  }, [existingAppointment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (existingAppointment) {
        const updated = await api.updateAppointment(existingAppointment._id, formData);
        updateRecord('appointments', updated);
      } else {
        const added = await api.addAppointment(formData);
        addRecord('appointments', added);
      }
      onFormSubmit(); // Closes the modal
    } catch (err) {
      setError(err.message || 'Failed to save appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Form fields */}
      <input name="doctorName" value={formData.doctorName} onChange={handleChange} placeholder="Doctor Name" required />
      <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="Specialty (e.g., Cardiology)" />
      <input name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose of visit" required />
      <input name="appointmentDateTime" value={formData.appointmentDateTime} onChange={handleChange} type="datetime-local" required />
      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location (e.g., General Hospital)" />
      <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes..."></textarea>
      
      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;