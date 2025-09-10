import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import Card from '../components/Card';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingJson, setLoadingJson] = useState(false);

  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    try {
      const blob = await api.exportPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MedLog_Report_${user.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to download PDF report.');
    } finally {
      setLoadingPdf(false);
    }
  };
  
  const handleDownloadJson = async () => {
    setLoadingJson(true);
    try {
      const data = await api.exportJson();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const a = document.createElement('a');
      a.href = jsonString;
      a.download = `MedLog_Backup_${user.name}.json`;
      a.click();
    } catch (error) {
      alert('Failed to download JSON backup.');
    } finally {
      setLoadingJson(false);
    }
  };

  return (
    <div className="container">
      <Card title="Profile & Settings">
        <div className="profile-info">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
        <div className="export-section">
          <h3>Data Portability</h3>
          <p>Download a copy of your health records.</p>
          <div className="export-buttons">
            <button className="btn btn-secondary" onClick={handleDownloadPdf} disabled={loadingPdf}>
              {loadingPdf ? 'Generating...' : 'Download PDF Summary'}
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadJson} disabled={loadingJson}>
              {loadingJson ? 'Generating...' : 'Export All Data (JSON)'}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;