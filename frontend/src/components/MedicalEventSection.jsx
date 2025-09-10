import React, { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import MedicalEventForm from './MedicalEventForm';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';
import '../styles/RecordList.css';

const MedicalEventSection = ({ medicalEvents, readOnly = false }) => {
    const { deleteRecord } = useData();
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
        if (window.confirm('Are you sure you want to delete this medical event?')) {
            try {
                await api.deleteMedicalEvent(id);
                deleteRecord('medicalEvents', id);
                toast.success('Medical event removed.');
            } catch (err) {
                toast.error(err.message || 'Failed to delete medical event.');
            }
        }
    };

    return (
        <>
            <Card title="Medical History" onAdd={() => openModal()} readOnly={readOnly} icon={<FontAwesomeIcon icon={faStethoscope} color="#007bff" />}>
                {medicalEvents.length > 0 ? (
                    <div className="record-list">
                        {medicalEvents.map(item => (
                            <div key={item._id} className="record-item">
                                <div className="record-details">
                                    <h4>{item.title} ({item.eventType})</h4>
                                    <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                                <div className="record-actions">
                                    {!readOnly && (
                                        <>
                                            <button onClick={() => openModal(item)} className="btn-edit">Edit</button>
                                            <button onClick={() => handleDelete(item._id)} className="btn-delete">Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-records">No medical events recorded.</p>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Medical Event' : 'Add Medical Event'}>
                <MedicalEventForm existingEvent={selectedItem} onFormSubmit={closeModal} />
            </Modal>
        </>
    );
};

export default MedicalEventSection;