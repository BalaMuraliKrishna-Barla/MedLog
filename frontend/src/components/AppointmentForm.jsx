// REPLACE the entire frontend/src/components/AppointmentForm.jsx file

import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faClipboard, faMapMarkerAlt, faStickyNote, faBuilding } from '@fortawesome/free-solid-svg-icons';

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
        doctorName: existingAppointment.doctorName || '',
        specialty: existingAppointment.specialty || '',
        purpose: existingAppointment.purpose || '',
        appointmentDateTime: existingAppointment.appointmentDateTime ? new Date(existingAppointment.appointmentDateTime).toISOString().slice(0, 16) : '',
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
        toast.success('Appointment updated successfully!');
      } else {
        const added = await api.addAppointment(formData);
        addRecord('appointments', added);
        toast.success('Appointment added successfully!');
      }
      onFormSubmit(); // Closes the modal
    } catch (err) {
      setError(err.message || 'Failed to save appointment.');
      toast.error(err.message || 'Failed to save appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
            <label>Doctor Name<span className="required-star">*</span></label>
            <input name="doctorName" value={formData.doctorName} onChange={handleChange} placeholder="Dr. Jane Smith" required />
            <FontAwesomeIcon icon={faUserMd} className="input-icon" />
        </div>
        <div className="input-group">
            <label>Specialty</label>
            <input name="specialty" value={formData.specialty} onChange={handleChange} placeholder="e.g., Cardiology" />
            <FontAwesomeIcon icon={faClipboard} className="input-icon" />
        </div>
        <div className="input-group">
            <label>Purpose of Visit<span className="required-star">*</span></label>
            <input name="purpose" value={formData.purpose} onChange={handleChange} placeholder="e.g., Annual Checkup" required />
            <FontAwesomeIcon icon={faBuilding} className="input-icon" />
        </div>
        <div className="input-group">
            <label>Date & Time<span className="required-star">*</span></label>
            <input name="appointmentDateTime" value={formData.appointmentDateTime} onChange={handleChange} type="datetime-local" required />
        </div>
        <div className="input-group">
            <label>Location</label>
            <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g., General Hospital, 2nd Floor" />
            <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
        </div>
        <div className="input-group">
            <label>Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Mentioned feeling dizzy..."></textarea>
            <FontAwesomeIcon icon={faStickyNote} className="input-icon" style={{transform: 'translateY(-25%)'}} />
        </div>
      
      {error && <div className="error-message">{error}</div>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;