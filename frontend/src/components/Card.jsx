import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const Card = ({ title, children, onAdd, icon, extraHeaderContent, readOnly = false }) => {
  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="card__header">
        <div className="card__title-container">
            {icon && <span className="card__icon">{icon}</span>}
            <h3 className="card__title">{title}</h3>
        </div>
        <div className="card__header-actions">
            {extraHeaderContent}
            {onAdd && !readOnly && (
              <button onClick={onAdd} className="btn btn-primary">
                + Add New
              </button>
            )}
        </div>
      </div>
      <div className="card__content">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;