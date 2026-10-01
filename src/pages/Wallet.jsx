import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { Wallet as WalletIcon } from 'lucide-react';

const Wallet = () => {
  return (
    <div className="app-container" style={{  minHeight: '100vh' }}>
      <TopNavbar />
      
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
             {/* ================= Header Section ================= */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* โลโก้จำลอง */}
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#333' }}>
              kinnon<span style={{color: '#e11d48'}}>.</span>
            </h1>
            {/* Badge ระดับผู้ใช้งาน */}
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1e293b', color: '#fbbf24', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
              ★ VIP <span style={{ color: '#fff', marginLeft: '4px' }}>{userData.level_name || 'Bronze'}</span>
            </div>
          </div>

          {/* กระเป๋าเงิน / ยอดเงิน */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#dcfce7', padding: '6px 12px', borderRadius: '20px', color: '#166534', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Ticket size={16} color="#16a34a" /> 
            <span>{currencySymbol} {isLoading ? '...' : formatCurrency(wallet.balance)}</span>
          </div>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Wallet;