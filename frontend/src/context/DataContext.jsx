import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    // Add appointments to the initial state
    const [records, setRecords] = useState({
        allergies: [], medications: [], vaccinations: [], vitals: [], medicalEvents: [], appointments: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const [allergies, medications, vaccinations, vitals, medicalEvents, appointments] = await Promise.all([
                api.getAllergies(user._id),
                api.getMedications(user._id),
                api.getVaccinations(user._id),
                api.getVitals(user._id),
                api.getMedicalEvents(user._id),
                api.getAppointments(user._id), // Fetch appointments
            ]);
            setRecords({ allergies, medications, vaccinations, vitals, medicalEvents, appointments });
        } catch (err) {
            setError('Failed to fetch health records.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user, fetchData]);

    // Function to add a new record to the state
    const addRecord = (type, newRecord) => {
        setRecords(prevRecords => ({
            ...prevRecords,
            [type]: [...prevRecords[type], newRecord]
        }));
    };
    
    // Function to update a record in the state
    const updateRecord = (type, updatedRecord) => {
        setRecords(prevRecords => ({
            ...prevRecords,
            [type]: prevRecords[type].map(record => record._id === updatedRecord._id ? updatedRecord : record)
        }));
    };

    // Function to delete a record from the state
    const deleteRecord = (type, recordId) => {
        setRecords(prevRecords => ({
            ...prevRecords,
            [type]: prevRecords[type].filter(record => record._id !== recordId)
        }));
    };

    const dataContextValue = {
        records,
        loading,
        error,
        fetchData,
        addRecord,
        updateRecord,
        deleteRecord,
    };

    return (
        <DataContext.Provider value={dataContextValue}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    return useContext(DataContext);
};