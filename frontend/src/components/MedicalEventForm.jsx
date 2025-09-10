import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const MedicalEventForm = ({ existingEvent, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        eventType: 'Diagnosis', title: '', date: new Date().toISOString().split('T')[0], description: '', doctorInvolved: '', location: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord, updateRecord } = useData();

    useEffect(() => {
        if (existingEvent) {
            setFormData({
                eventType: existingEvent.eventType || 'Diagnosis',
                title: existingEvent.title || '',
                date: existingEvent.date ? existingEvent.date.split('T')[0] : '',
                description: existingEvent.description || '',
                doctorInvolved: existingEvent.doctorInvolved || '',
                location: existingEvent.location || ''
            });
        }
    }, [existingEvent]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (existingEvent) {
                const updated = await api.updateMedicalEvent(existingEvent._id, formData);
                updateRecord('medicalEvents', updated);
            } else {
                const added = await api.addMedicalEvent(formData);
                addRecord('medicalEvents', added);
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save medical event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title (e.g., Flu Diagnosis)" required />
            <div className="input-group">
                <label>Event Type</label>
                <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                    <option>Diagnosis</option>
                    <option>Surgery</option>
                    <option>Hospitalization</option>
                    <option>Treatment</option>
                    <option>Other</option>
                </select>
            </div>
            <div className="input-group">
                <label>Date of Event</label>
                <input name="date" value={formData.date} onChange={handleChange} type="date" required />
            </div>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description..."></textarea>
            <input name="doctorInvolved" value={formData.doctorInvolved} onChange={handleChange} placeholder="Doctor Involved" />
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location (e.g., City Hospital)" />
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Event'}
            </button>
        </form>
    );
};

export default MedicalEventForm;