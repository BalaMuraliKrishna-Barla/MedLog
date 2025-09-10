import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faCalendarDay, faUserMd, faClipboard } from '@fortawesome/free-solid-svg-icons';

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
                toast.success('Vaccination updated!');
            } else {
                const added = await api.addVaccination(formData);
                addRecord('vaccinations', added);
                toast.success('Vaccination added!');
            }
            onFormSubmit();
        } catch (err) {
            setError(err.message || 'Failed to save vaccination.');
            toast.error(err.message || 'Failed to save vaccination.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Vaccine Name<span className="required-star">*</span></label>
                <input name="vaccineName" value={formData.vaccineName} onChange={handleChange} placeholder="e.g., COVID-19 (Pfizer)" required />
                <FontAwesomeIcon icon={faSyringe} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Date Administered<span className="required-star">*</span></label>
                <input name="dateAdministered" value={formData.dateAdministered} onChange={handleChange} type="date" required />
                 <FontAwesomeIcon icon={faCalendarDay} className="input-icon" style={{transform: 'translateY(0%)'}}/>
            </div>
            <div className="input-group">
                <label>Administered by (Optional)</label>
                <input name="administeredBy" value={formData.administeredBy} onChange={handleChange} placeholder="e.g., Dr. Smith or City Clinic" />
                <FontAwesomeIcon icon={faUserMd} className="input-icon" />
            </div>
            <div className="input-group">
                <label>Dosage (Optional)</label>
                <input name="dosage" value={formData.dosage} onChange={handleChange} placeholder="e.g., 1st Dose, Booster" />
                <FontAwesomeIcon icon={faClipboard} className="input-icon" />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Vaccination'}
            </button>
        </form>
    );
};

export default VaccinationForm;