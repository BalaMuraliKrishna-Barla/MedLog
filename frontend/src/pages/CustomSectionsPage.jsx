import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import Spinner from '../components/Spinner';
import Card from '../components/Card'; // Import the Card component
import CustomSection from '../components/CustomSection';
import CustomSectionForm from '../components/CustomSectionForm';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

const CustomSectionsPage = () => {
    const { records, loading, error } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading) return <Spinner />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <>
            <Card 
                title="Custom Health Sections" 
                onAdd={() => setIsModalOpen(true)}
                icon={<FontAwesomeIcon icon={faPlusSquare} color="#6f42c1" />} // Added a representative icon
            >
                {records.customSections.length > 0 ? (
                    // If there are sections, map over them and display each one.
                    // Each <CustomSection> is itself a <Card>.
                    records.customSections.map(section => (
                        <CustomSection key={section._id} section={section} />
                    ))
                ) : (
                    // If there are no sections, show a helpful message inside the main card.
                    <div style={{ textAlign: 'center', padding: 'var(--sp-3)'}}>
                        <p>You haven't created any custom sections yet.</p>
                        <p>Click the "+ Add New" button in the top-right to create your first one.</p>
                    </div>
                )}
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Section">
                <CustomSectionForm onFormSubmit={() => setIsModalOpen(false)} />
            </Modal>
        </>
    );
};

export default CustomSectionsPage;