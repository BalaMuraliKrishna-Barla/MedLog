import React from 'react';
import Modal from './Modal';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="confirmation-content">
                <p>{message}</p>
                <div className="confirmation-actions">
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn btn-danger">
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;