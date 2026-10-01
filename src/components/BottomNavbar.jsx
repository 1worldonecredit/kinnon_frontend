import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// 🌟 เปลี่ยนไอคอนนำเข้าใหม่ เอา Trophy กับ MessageCircle ออก แล้วใส่ Wallet กับ Store แทน
import { LayoutGrid, Wallet, Users, Store, PlaySquare } from 'lucide-react'; 

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <div className="bottom-navbar">
      <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
        <LayoutGrid size={22} />
        <span>หน้าหลัก</span>
      </Link>
      
      {/* 🌟 1. เปลี่ยนจาก ภารกิจ (/mission) เป็น กระเป๋าเงิน (/wallet) */}
      <Link to="/wallet" className={`nav-item ${location.pathname === '/wallet' ? 'active' : ''}`}>
        <Wallet size={22} />
        <span>กระเป๋าเงิน</span>
      </Link>

      {/* 🌟 เปลี่ยนจาก /prelogin เป็น / ให้ตรงกับที่ตั้งไว้ใน App.jsx */}
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <PlaySquare size={22} />
        <span>วีดีโอ</span>
      </Link>
      
      <Link to="/team" className={`nav-item ${location.pathname === '/team' ? 'active' : ''}`}>
        <Users size={22} />
        <span>ทีม</span>
      </Link>
      
      {/* 🌟 2. เปลี่ยนจาก แชท (/chat) เป็น ร้านค้า (/shop) */}
      <Link to="/shop" className={`nav-item ${location.pathname === '/shop' ? 'active' : ''}`}>
        <Store size={22} />
        <span>ร้านค้า</span>
      </Link>
    </div>
  );
};

export default BottomNavbar;