import React from 'react';
import { useData } from '../context/DataContext';
import AllergySection from '../components/AllergySection';
import Spinner from '../components/Spinner';

const AllergiesPage = () => {
    const { records, loading, error } = useData();

    if (loading) return <Spinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <h1>Allergies</h1>
            <p>Here you can manage all recorded allergies. Click "Add New" to create a new entry.</p>
            <AllergySection allergies={records.allergies} />
        </div>
    );
};

export default AllergiesPage;