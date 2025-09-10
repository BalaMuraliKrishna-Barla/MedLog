import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import './SharingPage.css';

const SharingPage = () => {
    const [grants, setGrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [granting, setGranting] = useState(false);

    const fetchGrants = async () => {
        try {
            const data = await api.getGrantedList();
            setGrants(data);
        } catch (err) {
            setError('Failed to fetch sharing status.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGrants();
    }, []);

    const handleGrantAccess = async (e) => {
        e.preventDefault();
        setGranting(true);
        setError('');
        try {
            await api.grantAccess(email);
            setEmail('');
            fetchGrants(); // Refresh the list
        } catch (err) {
            setError(err.message || 'Failed to grant access.');
        } finally {
            setGranting(false);
        }
    };

    const handleRevoke = async (grantId) => {
        if (window.confirm('Are you sure you want to revoke access for this user?')) {
            try {
                await api.revokeAccess(grantId);
                fetchGrants(); // Refresh the list
            } catch (err) {
                alert(err.message || 'Failed to revoke access.');
            }
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="container">
            <Card title="Grant Access">
                <form className="sharing-form" onSubmit={handleGrantAccess}>
                    <p>Enter the email address of a doctor or guardian to grant them read-only access to your records.</p>
                    <div className="input-group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="doctor@example.com"
                            required
                        />
                        <button type="submit" className="btn btn-primary" disabled={granting}>
                            {granting ? 'Sending...' : 'Grant Access'}
                        </button>
                    </div>
                    {error && <div className="error-message" style={{marginTop: '1rem'}}>{error}</div>}
                </form>
            </Card>

            <Card title="Manage Shared Access">
                <div className="grant-list">
                    {grants.length > 0 ? grants.map(grant => (
                        <div key={grant._id} className="grant-item">
                            <div className="grant-details">
                                <h4>{grant.grantee.name} ({grant.grantee.email})</h4>
                                <p>Status: <span className={`status status-${grant.status}`}>{grant.status}</span></p>
                            </div>
                            <button onClick={() => handleRevoke(grant._id)} className="btn btn-delete">
                                {grant.status === 'pending' ? 'Cancel Invite' : 'Revoke Access'}
                            </button>
                        </div>
                    )) : <p className="no-records">You have not shared your records with anyone.</p>}
                </div>
            </Card>
        </div>
    );
};

export default SharingPage;