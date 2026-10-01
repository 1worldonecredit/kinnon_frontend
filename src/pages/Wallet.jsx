import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { Wallet as WalletIcon } from 'lucide-react';

const Wallet = () => {
  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <TopNavbar />
      
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <WalletIcon size={64} color="#3b82f6" style={{ marginBottom: '20px', margin: '0 auto' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>กระเป๋าเงินของฉัน</h1>
          <p style={{ color: '#64748b' }}>หน้านี้กำลังอยู่ระหว่างการพัฒนาระบบ...</p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Wallet;