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
        name: user.name,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // NOTE: This handleSubmit is a placeholder for a future backend update.
  // We don't have a backend route to update the user model yet.
  const handleSubmit = (e) => {
      e.preventDefault();
      toast.error("Profile editing is not yet enabled on the backend.");
      // In the future, you would call an API like this:
      // const updatedUser = await api.updateUser(user._id, formData);
      // login(updatedUser, localStorage.getItem('userToken')); // Update context
      // toast.success('Profile updated!');
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