import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Modal from './Modal';
import MedicationForm from './MedicationForm';
import * as api from '../services/api';
import '../styles/RecordList.css';

const MedicationSection = () => {
    const { records, deleteRecord } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item = null) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this medication record?')) {
            try {
                await api.deleteMedication(id);
                deleteRecord('medications', id);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <>
            <Card title="Medications" onAdd={() => openModal()}>
                {records.medications.length > 0 ? (
                    <div className="record-list">
                        {records.medications.map(item => (
                            <div key={item._id} className="record-item">
                                <div className="record-details">
                                    <h4>{item.medicationName}</h4>
                                    <p>{item.dosage} - {item.frequency}</p>
                                </div>
                                <div className="record-actions">
                                    <button onClick={() => openModal(item)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(item._id)} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-records">No medication records found.</p>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Medication' : 'Add New Medication'}>
                <MedicationForm existingMedication={selectedItem} onFormSubmit={closeModal} />
            </Modal>
        </>
    );
};

export default MedicationSection;