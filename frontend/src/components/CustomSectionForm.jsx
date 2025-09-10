import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as api from '../services/api';
import { useData } from '../context/DataContext';

const CustomSectionForm = ({ onFormSubmit }) => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const { addRecord } = useData();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newSection = await api.addCustomSection({ title });
            addRecord('customSections', newSection);
            toast.success('New section created!');
            onFormSubmit();
        } catch (err) {
            toast.error(err.message || 'Failed to create section.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <p>Create a new section to track anything you need, like symptoms or therapy notes.</p>
            <div className="input-group">
                <label>Section Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Physical Therapy" required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Section'}
            </button>
        </form>
    );
};

export default CustomSectionForm;