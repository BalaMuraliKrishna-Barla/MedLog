import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Modal from './Modal';
import ConfirmationModal from './ConfirmationModal';
import AllergyForm from './AllergyForm';
import * as api from '../services/api';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAllergies } from '@fortawesome/free-solid-svg-icons';
import '../styles/RecordList.css';

const AllergySection = ({ allergies, readOnly = false }) => {
    const { deleteRecord } = useData();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedAllergy, setSelectedAllergy] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const openFormModal = (allergy = null) => {
        setSelectedAllergy(allergy);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedAllergy(null);
    };

    const openConfirmModal = (id) => {
        setItemToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setItemToDelete(null);
        setIsConfirmModalOpen(false);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.deleteAllergy(itemToDelete);
            deleteRecord('allergies', itemToDelete);
            toast.success('Allergy record removed.');
        } catch (err) {
            toast.error(err.message || 'Failed to delete allergy.');
        } finally {
            closeConfirmModal();
        }
    };

    return (
        <>
            <Card 
                title="Allergies" 
                onAdd={() => openFormModal()} 
                readOnly={readOnly} // This was the missing prop
                icon={<FontAwesomeIcon icon={faAllergies} color="#ffc107" />}
            >
                {allergies.length > 0 ? (
                    <div className="record-list">
                        {allergies.map(allergy => (
                            <div key={allergy._id} className="record-item">
                                <div className="record-details">
                                    <h4>{allergy.allergen} ({allergy.allergyType})</h4>
                                    <p>Severity: {allergy.severity} | Reaction: {allergy.reaction}</p>
                                </div>
                                <div className="record-actions">
                                    {!readOnly && (
                                        <>
                                            <button onClick={() => openFormModal(allergy)} className="btn-edit">Edit</button>
                                            <button onClick={() => openConfirmModal(allergy._id)} className="btn-delete">Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-records">No allergy records found.</p>
                )}
            </Card>

            <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={selectedAllergy ? 'Edit Allergy' : 'Add New Allergy'}>
                <AllergyForm existingAllergy={selectedAllergy} onFormSubmit={closeFormModal} />
            </Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this allergy record?"
            />
        </>
    );
};

export default AllergySection;