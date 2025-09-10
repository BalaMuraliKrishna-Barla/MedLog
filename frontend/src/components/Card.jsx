import React from 'react';
import './Card.css';

const Card = ({ title, children, onAdd }) => {
  return (
    <div className="card">
      <div className="card__header">
        <h3 className="card__title">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="btn btn-primary">
            + Add New
          </button>
        )}
      </div>
      <div className="card__content">
        {children}
      </div>
    </div>
  );
};

export default Card;