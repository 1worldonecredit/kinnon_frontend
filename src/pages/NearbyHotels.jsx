import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { MapPin } from 'lucide-react';

const NearbyHotels = () => {
  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <TopNavbar />
      
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <MapPin size={64} color="#ea580c" style={{ marginBottom: '20px', margin: '0 auto' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>ที่พักใกล้ฉัน</h1>
          <p style={{ color: '#64748b' }}>ค้นหาที่พักใกล้ตำแหน่งปัจจุบันของคุณ เร็วๆ นี้...</p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default NearbyHotels;