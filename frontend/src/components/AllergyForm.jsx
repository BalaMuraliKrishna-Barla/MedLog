import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const AllergyForm = ({ existingAllergy, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        allergen: '',
        severity: 'Mild',
        reaction: '',
        notes: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord, updateRecord } = useData();

    useEffect(() => {
        if (existingAllergy) {
            setFormData({
                allergen: existingAllergy.allergen || '',
                severity: existingAllergy.severity || 'Mild',
                reaction: existingAllergy.reaction || '',
                notes: existingAllergy.notes || ''
            });
        }
    }, [existingAllergy]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (existingAllergy) {
                const updated = await api.updateAllergy(existingAllergy._id, formData);
                updateRecord('allergies', updated);
            } else {
                const added = await api.addAllergy(formData);
                addRecord('allergies', added);
            }
            onFormSubmit(); // Close modal on success
        } catch (err) {
            setError(err.message || 'Failed to save allergy.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label htmlFor="allergen">Allergen</label>
                <input id="allergen" name="allergen" value={formData.allergen} onChange={handleChange} required />
            </div>
            <div className="input-group">
                <label htmlFor="severity">Severity</label>
                <select id="severity" name="severity" value={formData.severity} onChange={handleChange} required>
                    <option>Mild</option>
                    <option>Moderate</option>
                    <option>Severe</option>
                    <option>Unknown</option>
                </select>
            </div>
            <div className="input-group">
                <label htmlFor="reaction">Reaction</label>
                <input id="reaction" name="reaction" value={formData.reaction} onChange={handleChange} />
            </div>
            <div className="input-group">
                <label htmlFor="notes">Notes</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange}></textarea>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Allergy'}
            </button>
        </form>
    );
};

export default AllergyForm;