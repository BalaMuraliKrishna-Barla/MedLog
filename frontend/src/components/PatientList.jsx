import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import Card from './Card';
import Spinner from './Spinner';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        setLoading(true);
        const data = await api.getPatientList();
        setPatients(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    if (loading) return <Spinner />;

    return (
        <Card title="My Patients">
            {patients.length > 0 ? (
                <div className="record-list">
                    {patients.map(patient => (
                        <Link key={patient._id} to={`/records/${patient.owner._id}`} className="record-item-link">
                            <div className="record-item">
                                <h4>{patient.owner.name}</h4>
                                <p>{patient.owner.email}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="no-records">No patients have granted you access yet.</p>
            )}
        </Card>
    );
};

export default PatientList;