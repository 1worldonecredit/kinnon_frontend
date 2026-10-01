import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { Profile as ProfileIcon } from "lucide-react";

const Profile = () => {
  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <TopNavbar />
      
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Store size={64} color="#f59e0b" style={{ marginBottom: '20px', margin: '0 auto' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>ร้านค้า</h1>
          <p style={{ color: '#64748b' }}>พบกับหน้า Profile  เร็วๆ นี้...</p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Profile;