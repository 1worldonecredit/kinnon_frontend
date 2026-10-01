import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { Home } from 'lucide-react';

const MonthlyRentals = () => {
  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <TopNavbar />
      
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Home size={64} color="#16a34a" style={{ marginBottom: '20px', margin: '0 auto' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>ห้องเช่ารายเดือน</h1>
          <p style={{ color: '#64748b' }}>ค้นหาหอพักและห้องเช่ารายเดือนราคาถูก เร็วๆ นี้...</p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default MonthlyRentals;