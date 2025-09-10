import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Modal from './Modal';
import AllergyForm from './AllergyForm';
import * as api from '../services/api';
import '../styles/RecordList.css';

const AllergySection = () => {
    const { records, deleteRecord } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState(null);

    const openModal = (allergy = null) => {
        setSelectedAllergy(allergy);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAllergy(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this allergy record?')) {
            try {
                await api.deleteAllergy(id);
                deleteRecord('allergies', id);
            } catch (err) {
                alert(err.message || 'Failed to delete allergy.');
            }
        }
    };

    return (
        <>
            <Card title="Allergies" onAdd={() => openModal()}>
                {records.allergies.length > 0 ? (
                    <div className="record-list">
                        {records.allergies.map(allergy => (
                            <div key={allergy._id} className="record-item">
                                <div className="record-details">
                                    <h4>{allergy.allergen}</h4>
                                    <p>Severity: {allergy.severity} | Reaction: {allergy.reaction}</p>
                                </div>
                                <div className="record-actions">
                                    <button onClick={() => openModal(allergy)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(allergy._id)} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-records">No allergy records found.</p>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedAllergy ? 'Edit Allergy' : 'Add New Allergy'}>
                <AllergyForm existingAllergy={selectedAllergy} onFormSubmit={closeModal} />
            </Modal>
        </>
    );
};

export default AllergySection;