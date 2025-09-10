// REPLACE the entire file with this new version
import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

const AllergyForm = ({ existingAllergy, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        allergen: '',
        allergyType: 'Food',
        severity: 'Mild',
        reaction: '',
        firstNoted: '',
        notes: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord, updateRecord } = useData();

    useEffect(() => {
        if (existingAllergy) {
            setFormData({
                allergen: existingAllergy.allergen || '',
                allergyType: existingAllergy.allergyType || 'Food',
                severity: existingAllergy.severity || 'Mild',
                reaction: existingAllergy.reaction || '',
                firstNoted: existingAllergy.firstNoted ? existingAllergy.firstNoted.split('T')[0] : '',
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
                toast.success('Allergy record updated!');
            } else {
                const added = await api.addAllergy(formData);
                addRecord('allergies', added);
                toast.success('Allergy record added!');
            }
            onFormSubmit(); // Close modal on success
        } catch (err) {
            setError(err.message || 'Failed to save allergy.');
            toast.error(err.message || 'Failed to save allergy.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label htmlFor="allergen">Allergen</label>
                <input id="allergen" name="allergen" value={formData.allergen} onChange={handleChange} placeholder="e.g., Peanuts" required />
            </div>
            <div className="input-group">
                <label htmlFor="allergyType">Allergy Type</label>
                <select id="allergyType" name="allergyType" value={formData.allergyType} onChange={handleChange} required>
                    <option>Food</option>
                    <option>Drug</option>
                    <option>Environmental</option>
                    <option>Insect</option>
                    <option>Other</option>
                </select>
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
                <label htmlFor="firstNoted">Date First Noted (Optional)</label>
                <input id="firstNoted" name="firstNoted" value={formData.firstNoted} onChange={handleChange} type="date" />
            </div>
            <div className="input-group">
                <label htmlFor="reaction">Reaction (Optional)</label>
                <input id="reaction" name="reaction" value={formData.reaction} onChange={handleChange} placeholder="e.g., Hives, Swelling" />
            </div>
            <div className="input-group">
                <label htmlFor="notes">Notes (Optional)</label>
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