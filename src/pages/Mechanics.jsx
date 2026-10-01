import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { Wrench } from 'lucide-react';

const Mechanics = () => (
  <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
    <TopNavbar />
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Wrench size={64} color="#0284c7" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>อู่ซ่อมรถใกล้ฉัน</h1>
    </div>
    <BottomNavbar />
  </div>
);
export default Mechanics;