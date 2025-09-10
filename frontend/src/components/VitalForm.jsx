import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const VitalForm = ({ existingVital, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        recordDate: new Date().toISOString().split('T')[0],
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        bloodSugar: '',
        weight: '',
        notes: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord, updateRecord } = useData();

    useEffect(() => {
        if (existingVital) {
            setFormData({
                recordDate: existingVital.recordDate ? existingVital.recordDate.split('T')[0] : '',
                bloodPressure: existingVital.bloodPressure || '',
                heartRate: existingVital.heartRate || '',
                temperature: existingVital.temperature || '',
                bloodSugar: existingVital.bloodSugar || '',
                weight: existingVital.weight || '',
                notes: existingVital.notes || ''
            });
        }
    }, [existingVital]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (existingVital) {
                const updated = await api.updateVital(existingVital._id, formData);
                updateRecord('vitals', updated);
            } else {
                const added = await api.addVital(formData);
                addRecord('vitals', added);
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save vitals record.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Record Date</label>
                <input name="recordDate" value={formData.recordDate} onChange={handleChange} type="date" required />
            </div>
            <input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="Blood Pressure (e.g., 120/80)" />
            <input name="heartRate" value={formData.heartRate} onChange={handleChange} type="number" placeholder="Heart Rate (bpm)" />
            <input name="temperature" value={formData.temperature} onChange={handleChange} type="number" placeholder="Temperature (°C)" />
            <input name="bloodSugar" value={formData.bloodSugar} onChange={handleChange} type="number" placeholder="Blood Sugar (mg/dL)" />
            <input name="weight" value={formData.weight} onChange={handleChange} type="number" placeholder="Weight (kg)" />
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes..."></textarea>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Vitals'}
            </button>
        </form>
    );
};

export default VitalForm;