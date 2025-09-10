import React from 'react';
import './Card.css';

const Card = ({ title, children, onAdd, icon, extraHeaderContent, readOnly = false }) => {
  return (
    <div className="card">
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
    </div>
  );
};

export default Card;
