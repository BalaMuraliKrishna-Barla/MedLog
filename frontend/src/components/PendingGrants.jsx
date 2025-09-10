import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import Card from './Card';
import Spinner from './Spinner';
import toast from 'react-hot-toast';

const PendingGrants = ({ onGrantUpdate }) => {
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInvites = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await api.getPendingGrants();
            setInvites(data);
        } catch (err) {
            setError('Could not load pending invitations.');
            toast.error(err.message || 'Could not load invitations.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);

    const handleAccept = async (grantId) => {
        const toastId = toast.loading('Accepting invitation...');
        try {
            await api.acceptGrant(grantId);
            toast.success('Invitation accepted! Patient added to your list.', { id: toastId });
            onGrantUpdate(); // This will trigger a refresh on the parent
            fetchInvites(); // Re-fetch invites to update this component's list
        } catch (err) {
            toast.error(err.message || 'Failed to accept invitation.', { id: toastId });
        }
    };

    const renderContent = () => {
        if (loading) return <Spinner />;
        if (error) return <p className="error-message">{error}</p>;
        if (invites.length === 0) {
            return <p className="no-records">You have no pending invitations from patients.</p>;
        }
        return (
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
        );
    };

    return (
        <Card title="Pending Invitations">
            {renderContent()}
        </Card>
    );
};

export default PendingGrants;