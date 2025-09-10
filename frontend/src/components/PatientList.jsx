import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import Card from './Card';
import Spinner from './Spinner';
import toast from 'react-hot-toast';
const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const fetchPatients = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getPatientList();
            setPatients(data);
        } catch (err) {
            setError('Could not load patient list.');
            toast.error(err.message || 'Could not load patients.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const renderContent = () => {
        if (loading) return <Spinner />;
        if (error) return <p className="error-message">{error}</p>;
        if (patients.length === 0) {
            return <p className="no-records">No patients have granted you access yet.</p>;
        }
        return (
            <div className="record-list">
                {patients.map(patient => (
                    <Link key={patient._id} to={`/records/${patient.owner._id}`} className="record-item-link">
                        <div className="record-item">
                            <div className="record-details">
                                <h4>{patient.owner.name}</h4>
                                <p>{patient.owner.email}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <Card title="My Patients">
            {renderContent()}
        </Card>
    );
}

export default PatientList;