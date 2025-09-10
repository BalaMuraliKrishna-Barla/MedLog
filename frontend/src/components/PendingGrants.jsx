import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import Card from './Card';

const PendingGrants = ({ onGrantUpdate }) => {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInvites = async () => {
        setLoading(true);
        const data = await api.getPendingGrants();
        setInvites(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const handleAccept = async (grantId) => {
        await api.acceptGrant(grantId);
        onGrantUpdate(); // This will trigger a refresh on the parent
    };

    if (loading) return <p>Loading invitations...</p>;
    if (invites.length === 0) return null; // Don't show the card if there are no invites

    return (
        <Card title="Pending Invitations">
            <div className="grant-list">
                {invites.map(invite => (
                    <div key={invite._id} className="grant-item">
                        <div className="grant-details">
                            <h4>{invite.owner.name}</h4>
                            <p>{invite.owner.email}</p>
                        </div>
                        <button onClick={() => handleAccept(invite._id)} className="btn btn-primary">Accept</button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default PendingGrants;