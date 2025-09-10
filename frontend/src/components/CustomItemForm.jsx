import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const CustomItemForm = ({ sectionId, onFormSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const { updateRecord } = useData();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedSection = await api.addItemToSection(sectionId, formData);
            updateRecord('customSections', updatedSection);
            toast.success('New item added!');
            onFormSubmit();
        } catch (err) {
            toast.error(err.message || 'Failed to add item.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Title / Entry</label>
                <input name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="input-group">
                <label>Date</label>
                <input name="date" type="date" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="input-group">
                <label>Description (optional)</label>
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Entry'}
            </button>
        </form>
    );
};

export default CustomItemForm;