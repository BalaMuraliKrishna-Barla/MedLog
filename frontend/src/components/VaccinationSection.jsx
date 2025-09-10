import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Modal from './Modal';
import VaccinationForm from './VaccinationForm';
import * as api from '../services/api';
import '../styles/RecordList.css';

const VaccinationSection = () => {
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
        if (window.confirm('Are you sure you want to delete this vaccination record?')) {
            try {
                await api.deleteVaccination(id);
                deleteRecord('vaccinations', id);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <>
            <Card title="Vaccinations" onAdd={() => openModal()}>
                {records.vaccinations.length > 0 ? (
                    <div className="record-list">
                        {records.vaccinations.map(item => (
                            <div key={item._id} className="record-item">
                                <div className="record-details">
                                    <h4>{item.vaccineName}</h4>
                                    <p>Date: {new Date(item.dateAdministered).toLocaleDateString()}</p>
                                </div>
                                <div className="record-actions">
                                    <button onClick={() => openModal(item)} className="btn-edit">Edit</button>
                                    <button onClick={() => handleDelete(item._id)} className="btn-delete">Delete</button>
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