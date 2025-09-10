// REPLACE the entire file with this new version
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Modal from './Modal';
import MedicationForm from './MedicationForm';
import ConfirmationModal from './ConfirmationModal';
import * as api from '../services/api';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPills } from '@fortawesome/free-solid-svg-icons';
import '../styles/RecordList.css';

const MedicationSection = () => {
    const { records, deleteRecord } = useData();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const openFormModal = (item = null) => {
        setSelectedItem(item);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setSelectedItem(null);
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
            await api.deleteMedication(itemToDelete);
            deleteRecord('medications', itemToDelete);
            toast.success('Medication record removed.');
        } catch (err) {
            toast.error(err.message || 'Failed to delete medication.');
        } finally {
            closeConfirmModal();
        }
    };

    // Helper to format the frequency display
    const formatFrequency = (freq) => {
        if (!freq) return 'Not specified';
        const { timesPerDay, timings } = freq;
        if (!timings || timings.length === 0) return `${timesPerDay} time(s) a day`;
        return `${timings.join(', ')}`;
    };

    return (
        <>
            <Card title="Medications" onAdd={() => openFormModal()} icon={<FontAwesomeIcon icon={faPills} color="#28a745" />}>
                {records.medications.length > 0 ? (
                    <div className="record-list">
                        {records.medications.map(item => (
                            <div key={item._id} className="record-item">
                                <div className="record-details">
                                    <h4>{item.medicationName} ({item.dosage})</h4>
                                    <p>{formatFrequency(item.frequency)} - {item.instructions}</p>
                                </div>
                                <div className="record-actions">
                                    <button onClick={() => openFormModal(item)} className="btn-edit">Edit</button>
                                    <button onClick={() => openConfirmModal(item._id)} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-records">No medication records found.</p>
                )}
            </Card>

            <Modal isOpen={isFormModalOpen} onClose={closeFormModal} title={selectedItem ? 'Edit Medication' : 'Add New Medication'}>
                <MedicationForm existingMedication={selectedItem} onFormSubmit={closeFormModal} />
            </Modal>

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={handleDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this medication record?"
            />
        </>
    );
};

export default MedicationSection;