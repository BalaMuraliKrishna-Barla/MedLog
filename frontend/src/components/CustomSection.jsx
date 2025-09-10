import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Card from './Card';
import Modal from './Modal';
import CustomItemForm from './CustomItemForm';
import ConfirmationModal from './ConfirmationModal';
import * as api from '../services/api';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/RecordList.css';

const CustomSection = ({ section }) => {
    const { updateRecord, deleteRecord } = useData();
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const handleDeleteSection = async () => {
        try {
            await api.deleteCustomSection(section._id);
            deleteRecord('customSections', section._id);
            toast.success('Section deleted!');
        } catch (err) {
            toast.error(err.message || 'Failed to delete section.');
        }
    };

    const openConfirmDeleteItem = (itemId) => {
        setItemToDelete(itemId);
        setIsConfirmOpen(true);
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;
        try {
            const updatedSection = await api.deleteItemFromSection(section._id, itemToDelete);
            updateRecord('customSections', updatedSection);
            toast.success('Item removed.');
        } catch (err) {
            toast.error(err.message || 'Failed to remove item.');
        } finally {
            setIsConfirmOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <>
            <Card
                title={section.title}
                icon={<FontAwesomeIcon icon={['fas', 'notes-medical']} />} // Using a default icon
                onAdd={() => setIsItemModalOpen(true)}
                extraHeaderContent={
                    <button onClick={handleDeleteSection} className="btn-delete-section">
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                }
            >
                {section.items && section.items.length > 0 ? (
                    <div className="record-list">
                        {section.items.map(item => (
                            <div key={item._id} className="record-item">
                                <div className="record-details">
                                    <h4>{item.title}</h4>
                                    <p>Date: {new Date(item.date).toLocaleDateString()}</p>
                                    {item.description && <p className="record-description">{item.description}</p>}
                                </div>
                                <div className="record-actions">
                                    <button onClick={() => openConfirmDeleteItem(item._id)} className="btn-delete">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-records">No entries added to this section yet.</p>
                )}
            </Card>

            <Modal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} title={`Add to ${section.title}`}>
                <CustomItemForm sectionId={section._id} onFormSubmit={() => setIsItemModalOpen(false)} />
            </Modal>
            
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteItem}
                title="Confirm Delete"
                message="Are you sure you want to delete this entry?"
            />
        </>
    );
};

export default CustomSection;