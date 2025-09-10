// REPLACE the entire file with this new version
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

const timingOptions = ['Morning', 'Afternoon', 'Evening', 'Night'];

const MedicationForm = ({ existingMedication, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        medicationName: '', dosage: '', reason: '', startDate: '', endDate: '',
        frequency: { timesPerDay: 1, timings: ['Morning'] },
        instructions: 'Any Time'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord, updateRecord } = useData();

    useEffect(() => {
        if (existingMedication) {
            setFormData({
                medicationName: existingMedication.medicationName || '',
                dosage: existingMedication.dosage || '',
                reason: existingMedication.reason || '',
                startDate: existingMedication.startDate ? existingMedication.startDate.split('T')[0] : '',
                endDate: existingMedication.endDate ? existingMedication.endDate.split('T')[0] : '',
                frequency: existingMedication.frequency || { timesPerDay: 1, timings: ['Morning'] },
                instructions: existingMedication.instructions || 'Any Time'
            });
        }
    }, [existingMedication]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFrequencyChange = (e) => {
        const times = parseInt(e.target.value, 10);
        setFormData({ ...formData, frequency: { ...formData.frequency, timesPerDay: times, timings: [] } });
    };

    const handleTimingsChange = (timing) => {
        const currentTimings = formData.frequency.timings || [];
        const newTimings = currentTimings.includes(timing)
            ? currentTimings.filter(t => t !== timing)
            : [...currentTimings, timing];

        // Do not allow selecting more than the timesPerDay value
        if (newTimings.length > formData.frequency.timesPerDay) {
            toast.error(`You can only select ${formData.frequency.timesPerDay} time(s).`);
            return;
        }

        setFormData({ ...formData, frequency: { ...formData.frequency, timings: newTimings } });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.frequency.timings.length !== formData.frequency.timesPerDay) {
            setError(`Please select exactly ${formData.frequency.timesPerDay} time slot(s).`);
            return;
        }
        setLoading(true);
        setError('');
        try {
            if (existingMedication) {
                const updated = await api.updateMedication(existingMedication._id, formData);
                updateRecord('medications', updated);
                toast.success('Medication updated successfully!');
            } else {
                const added = await api.addMedication(formData);
                addRecord('medications', added);
                toast.success('Medication added successfully!');
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save medication.');
            toast.error(err.message || 'Failed to save medication.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Medication Name</label>
                <input name="medicationName" value={formData.medicationName} onChange={handleChange} placeholder="e.g., Paracetamol" required />
            </div>
            <div className="input-group">
                <label>Dosage</label>
                <input name="dosage" value={formData.dosage} onChange={handleChange} placeholder="e.g., 500mg" required />
            </div>
            <div className="input-group">
                <label>Times Per Day</label>
                <select name="timesPerDay" value={formData.frequency.timesPerDay} onChange={handleFrequencyChange}>
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>
            <div className="input-group">
                <label>Select Time(s)</label>
                <div className="checkbox-group">
                    {timingOptions.map(timing => (
                        <label key={timing}>
                            <input
                                type="checkbox"
                                checked={formData.frequency.timings.includes(timing)}
                                onChange={() => handleTimingsChange(timing)}
                            /> {timing}
                        </label>
                    ))}
                </div>
            </div>
            <div className="input-group">
                <label>Instructions</label>
                <select name="instructions" value={formData.instructions} onChange={handleChange}>
                    <option>Any Time</option>
                    <option>Before Food</option>
                    <option>After Food</option>
                </select>
            </div>
            <div className="input-group">
                <label>Start Date</label>
                <input name="startDate" value={formData.startDate} onChange={handleChange} type="date" required />
            </div>
            <div className="input-group">
                <label>End Date (optional)</label>
                <input name="endDate" value={formData.endDate} onChange={handleChange} type="date" />
            </div>
            <div className="input-group">
                <label>Reason for taking (optional)</label>
                <input name="reason" value={formData.reason} onChange={handleChange} placeholder="e.g., Headache" />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Medication'}
            </button>
        </form>
    );
};

export default MedicationForm;