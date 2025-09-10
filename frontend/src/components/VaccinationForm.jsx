import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const VaccinationForm = ({ existingVaccination, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        vaccineName: '', dateAdministered: '', administeredBy: '', dosage: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord, updateRecord } = useData();

    useEffect(() => {
        if (existingVaccination) {
            setFormData({
                vaccineName: existingVaccination.vaccineName || '',
                dateAdministered: existingVaccination.dateAdministered ? existingVaccination.dateAdministered.split('T')[0] : '',
                administeredBy: existingVaccination.administeredBy || '',
                dosage: existingVaccination.dosage || '',
            });
        }
    }, [existingVaccination]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (existingVaccination) {
                const updated = await api.updateVaccination(existingVaccination._id, formData);
                updateRecord('vaccinations', updated);
            } else {
                const added = await api.addVaccination(formData);
                addRecord('vaccinations', added);
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save vaccination.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <input name="vaccineName" value={formData.vaccineName} onChange={handleChange} placeholder="Vaccine Name" required />
            <div className="input-group">
                <label>Date Administered</label>
                <input name="dateAdministered" value={formData.dateAdministered} onChange={handleChange} type="date" required />
            </div>
            <input name="administeredBy" value={formData.administeredBy} onChange={handleChange} placeholder="Administered by (e.g., Dr. Smith)" />
            <input name="dosage" value={formData.dosage} onChange={handleChange} placeholder="Dosage (e.g., 1st Dose, Booster)" />
            
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Vaccination'}
            </button>
        </form>
    );
};

export default VaccinationForm;