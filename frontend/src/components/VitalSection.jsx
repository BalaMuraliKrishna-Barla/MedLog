import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Modal from './Modal';
import VitalForm from './VitalForm';
import * as api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import '../styles/RecordList.css';
import toast from 'react-hot-toast';

const VitalSection = ({ vitals, readOnly = false }) => {
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
        if (window.confirm('Are you sure you want to delete this vitals record?')) {
            try {
                await api.deleteVital(id);
                deleteRecord('vitals', id);
                toast.success('Vitals record removed.');
            } catch (err) {
                toast.error(err.message || 'Failed to delete vitals record.');
            }
        }
    };

    return (
        <>
            <Card 
                title="Vitals" 
                onAdd={() => openModal()} 
                readOnly={readOnly} // This was the missing prop
                icon={<FontAwesomeIcon icon={faHeartbeat} color="#dc3545" />}
            >
                {vitals.length > 0 ? (
                    <div className="record-list">
                        {vitals.map(item => (
                            <div key={item._id} className="record-item">
                                <div className="record-details">
                                    <h4>{new Date(item.recordDate).toLocaleDateString()}</h4>
                                    <p>BP: {item.bloodPressure || 'N/A'} | HR: {item.heartRate || 'N/A'} bpm</p>
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
                    <p className="no-records">No vitals recorded yet.</p>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Vitals' : 'Add New Vitals'}>
                <VitalForm existingVital={selectedItem} onFormSubmit={closeModal} />
            </Modal>
        </>
    );
};

export default VitalSection;