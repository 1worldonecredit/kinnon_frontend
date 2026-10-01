import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { ClipboardList } from 'lucide-react';

const Orders = () => (
  <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
    <TopNavbar />
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ClipboardList size={64} color="#0284c7" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>ออร์เดอร์ของฉัน</h1>
      <p style={{ color: '#64748b' }}>หน้านี้กำลังอยู่ระหว่างการพัฒนาระบบ...</p>
    </div>
    <BottomNavbar />
  </div>
);
export default Orders;