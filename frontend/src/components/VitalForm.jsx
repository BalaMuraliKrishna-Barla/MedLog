import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faHeartbeat, faThermometerHalf, faTint, faWeight, faStickyNote, faRulerVertical } from '@fortawesome/free-solid-svg-icons';


const VitalForm = ({ existingVital, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        recordDate: new Date().toISOString().split('T')[0],
        bloodPressure: '', heartRate: '', temperature: '', bloodSugar: '', weight: '', notes: ''
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
                toast.success('Vitals record updated!');
            } else {
                const added = await api.addVital(formData);
                addRecord('vitals', added);
                toast.success('Vitals record added!');
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save vitals record.');
            toast.error(err.message || 'Failed to save vitals record.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Record Date<span className="required-star">*</span></label>
                <input name="recordDate" value={formData.recordDate} onChange={handleChange} type="date" required />
                <FontAwesomeIcon icon={faCalendarDay} className="input-icon" style={{transform: 'translateY(0%)'}}/>
            </div>
             <div className="input-group">
                <label>Blood Pressure (e.g., 120/80)</label>
                <input name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="Systolic/Diastolic" />
                 <FontAwesomeIcon icon={faHeartbeat} className="input-icon" />
            </div>
             <div className="input-group">
                <label>Heart Rate (bpm)</label>
                <input name="heartRate" value={formData.heartRate} onChange={handleChange} type="number" placeholder="Beats per minute" />
                 <FontAwesomeIcon icon={faRulerVertical} className="input-icon" />
            </div>
             <div className="input-group">
                <label>Temperature (°C or °F)</label>
                <input name="temperature" value={formData.temperature} onChange={handleChange} type="number" placeholder="e.g., 37.0 or 98.6" />
                 <FontAwesomeIcon icon={faThermometerHalf} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Blood Sugar (mg/dL)</label>
                <input name="bloodSugar" value={formData.bloodSugar} onChange={handleChange} type="number" placeholder="e.g., 90" />
                 <FontAwesomeIcon icon={faTint} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Weight (kg or lbs)</label>
                <input name="weight" value={formData.weight} onChange={handleChange} type="number" placeholder="e.g., 70" />
                 <FontAwesomeIcon icon={faWeight} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any relevant notes..."></textarea>
                 <FontAwesomeIcon icon={faStickyNote} className="input-icon" style={{transform: 'translateY(-25%)'}}/>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Vitals'}
            </button>
        </form>
    );
};

export default VitalForm;