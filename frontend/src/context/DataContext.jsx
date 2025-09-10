// REPLACE the entire file with this new version
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [records, setRecords] = useState({
        allergies: [], medications: [], vaccinations: [], vitals: [], medicalEvents: [], appointments: [], customSections: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            // Fetch all record types in parallel
            const [allergies, medications, vaccinations, vitals, medicalEvents, appointments, customSections] = await Promise.all([
                api.getAllergies(user._id),
                api.getMedications(user._id),
                api.getVaccinations(user._id),
                api.getVitals(user._id),
                api.getMedicalEvents(user._id),
                api.getAppointments(user._id),
                api.getCustomSections(user._id), // Fetch custom sections
            ]);
            setRecords({ allergies, medications, vaccinations, vitals, medicalEvents, appointments, customSections });
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
            setLoading(false); // If there's no user, we're not loading data.
        }
    }, [user, fetchData]);

    const addRecord = (type, newRecord) => {
        setRecords(prevRecords => ({
            ...prevRecords,
            [type]: [newRecord, ...prevRecords[type]] // Add to the beginning of the list
        }));
    };
    
    const updateRecord = (type, updatedRecord) => {
        setRecords(prevRecords => ({
            ...prevRecords,
            [type]: prevRecords[type].map(record => record._id === updatedRecord._id ? updatedRecord : record)
        }));
    };

    const deleteRecord = (type, recordId) => {
        setRecords(prevRecords => ({
            ...prevRecords,
            [type]: prevRecords[type].filter(record => record._id !== recordId)
        }));
    };

    const dataContextValue = {
        records, loading, error, fetchData, addRecord, updateRecord, deleteRecord,
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