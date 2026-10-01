import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { CarTaxiFront } from 'lucide-react';

const Taxis = () => (
  <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
    <TopNavbar />
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <CarTaxiFront size={64} color="#0284c7" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>บริการเรียกรถรับจ้าง</h1>
    </div>
    <BottomNavbar />
  </div>
);
export default Taxis;