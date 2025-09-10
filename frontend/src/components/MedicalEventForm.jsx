import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faCalendarDay, faFileMedical, faUserMd, faMapMarkerAlt, faStickyNote } from '@fortawesome/free-solid-svg-icons';

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
                toast.success('Medical event updated!');
            } else {
                const added = await api.addMedicalEvent(formData);
                addRecord('medicalEvents', added);
                toast.success('Medical event added!');
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save medical event.');
            toast.error(err.message || 'Failed to save medical event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Event Title<span className="required-star">*</span></label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Annual Physical Exam" required />
                <FontAwesomeIcon icon={faFileMedical} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Event Type<span className="required-star">*</span></label>
                <select name="eventType" value={formData.eventType} onChange={handleChange} required>
                    <option>Diagnosis</option>
                    <option>Surgery</option>
                    <option>Hospitalization</option>
                    <option>Treatment</option>
                    <option>Other</option>
                </select>
            </div>
            <div className="input-group">
                <label>Date of Event<span className="required-star">*</span></label>
                <input name="date" value={formData.date} onChange={handleChange} type="date" required />
                <FontAwesomeIcon icon={faCalendarDay} className="input-icon" style={{transform: 'translateY(0%)'}}/>
            </div>
            <div className="input-group">
                <label>Doctor Involved (Optional)</label>
                <input name="doctorInvolved" value={formData.doctorInvolved} onChange={handleChange} placeholder="e.g., Dr. Smith" />
                <FontAwesomeIcon icon={faUserMd} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Location (Optional)</label>
                <input name="location" value={formData.location} onChange={handleChange} placeholder="e.g., City Hospital" />
                <FontAwesomeIcon icon={faMapMarkerAlt} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Description (Optional)</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Details about the event..."></textarea>
                <FontAwesomeIcon icon={faStickyNote} className="input-icon" style={{transform: 'translateY(-25%)'}}/>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Event'}
            </button>
        </form>
    );
};

export default MedicalEventForm;