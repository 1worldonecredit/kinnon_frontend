import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { Utensils } from 'lucide-react';

const Restaurants = () => {
  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <TopNavbar />
      
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Utensils size={64} color="#7c3aed" style={{ marginBottom: '20px', margin: '0 auto' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>ร้านอาหารใกล้ฉัน</h1>
          <p style={{ color: '#64748b' }}>ค้นหาร้านอาหารอร่อยๆ รอบตัวคุณ เร็วๆ นี้...</p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Restaurants;