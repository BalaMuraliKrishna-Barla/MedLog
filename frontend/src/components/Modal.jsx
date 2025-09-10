import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.css';

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
};

const modalVariants = {
    hidden: { opacity: 0, y: "-50px", scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: "50px", scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }
};

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay" 
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          key="backdrop" // Add key for AnimatePresence
        >
          <motion.div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="modal-header">
              <h2 className="modal-title">{title}</h2>
              <button className="modal-close-btn" onClick={onClose}>&times;</button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;