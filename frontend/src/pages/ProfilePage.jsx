// REPLACE the entire file with this new version
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, login } = useAuth(); // We need login to update the context
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '' });
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', // Fallback to empty string
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating profile...');
    try {
        // The API will return the updated Profile document, which includes the user object
        const updatedProfile = await api.updateProfile(formData);
        
        // The user object is nested inside the updated profile data
        const updatedUser = updatedProfile.user;

        // We use the login function from AuthContext to update the user state globally.
        // We pass the new user object and the existing token.
        login(updatedUser, localStorage.getItem('userToken'));
        
        toast.success('Profile updated successfully!', { id: toastId });
    } catch (err) {
        toast.error(err.message || 'Failed to update profile.', { id: toastId });
    }
}

  if (loading) return <Spinner />;

  return (
    <div className="container">
      <Card title="My Profile">
        <form className="profile-form" onSubmit={handleSubmit}>
            <div className="input-group">
                <label>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} />
            </div>
             <div className="input-group">
                <label>Date of Birth</label>
                <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
             <div className="input-group">
                <label>Email</label>
                <input value={user?.email} disabled />
            </div>
            <div className="input-group">
                <label>Role</label>
                <input value={user?.role} disabled />
            </div>
            <button type="submit" className="btn btn-primary">Save Changes</button>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;