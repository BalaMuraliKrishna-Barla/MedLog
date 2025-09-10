import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const MedicationForm = ({ existingMedication, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        medicationName: '', dosage: '', frequency: '', reason: '', startDate: '', endDate: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord, updateRecord } = useData();

    useEffect(() => {
        if (existingMedication) {
            setFormData({
                medicationName: existingMedication.medicationName || '',
                dosage: existingMedication.dosage || '',
                frequency: existingMedication.frequency || '',
                reason: existingMedication.reason || '',
                startDate: existingMedication.startDate ? existingMedication.startDate.split('T')[0] : '',
                endDate: existingMedication.endDate ? existingMedication.endDate.split('T')[0] : '',
            });
        }
    }, [existingMedication]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (existingMedication) {
                const updated = await api.updateMedication(existingMedication._id, formData);
                updateRecord('medications', updated);
            } else {
                const added = await api.addMedication(formData);
                addRecord('medications', added);
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save medication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input name="medicationName" value={formData.medicationName} onChange={handleChange} placeholder="Medication Name" required />
            <input name="dosage" value={formData.dosage} onChange={handleChange} placeholder="Dosage (e.g., 500mg)" required />
            <input name="frequency" value={formData.frequency} onChange={handleChange} placeholder="Frequency (e.g., Twice a day)" required />
            <input name="reason" value={formData.reason} onChange={handleChange} placeholder="Reason for taking" />
            <div className="input-group">
                <label>Start Date</label>
                <input name="startDate" value={formData.startDate} onChange={handleChange} type="date" required />
            </div>
            <div className="input-group">
                <label>End Date (optional)</label>
                <input name="endDate" value={formData.endDate} onChange={handleChange} type="date" />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Medication'}
            </button>
        </form>
    );
};

export default MedicationForm;