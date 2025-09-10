import React, { useState } from 'react';
import Card from './Card';
import Modal from './Modal';
import VaccinationForm from './VaccinationForm';
import * as api from '../services/api';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';
import '../styles/RecordList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe } from '@fortawesome/free-solid-svg-icons';

const VaccinationSection = ({ vaccinations, readOnly = false }) => {
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
        if (window.confirm('Are you sure you want to delete this vaccination record?')) {
            try {
                await api.deleteVaccination(id);
                deleteRecord('vaccinations', id);
                toast.success('Vaccination record removed.');
            } catch (err) {
                toast.error(err.message || 'Failed to delete vaccination.');
            }
        }
    };

    return (
        <>
            <Card title="Vaccinations" onAdd={() => openModal()} readOnly={readOnly} icon={<FontAwesomeIcon icon={faSyringe} color="#17a2b8" />}>
                {vaccinations.length > 0 ? (
                    <div className="record-list">
                        {vaccinations.map(item => (
                            <div key={item._id} className="record-item">
                                <div className="record-details">
                                    <h4>{item.vaccineName}</h4>
                                    <p>Date: {new Date(item.dateAdministered).toLocaleDateString()}</p>
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
                    <p className="no-records">No vaccination records found.</p>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Vaccination' : 'Add New Vaccination'}>
                <VaccinationForm existingVaccination={selectedItem} onFormSubmit={closeModal} />
            </Modal>
        </>
    );
};

export default VaccinationSection;