import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Trophy, Users, MessageCircle, PlaySquare } from 'lucide-react'; // 🌟 เพิ่ม PlaySquare สำหรับวีดีโอ

const BottomNavbar = () => {
  const location = useLocation();

  return (
    <div className="bottom-navbar">
      <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
        <LayoutGrid size={22} />
        <span>หน้าหลัก</span>
      </Link>
      
      <Link to="/mission" className={`nav-item ${location.pathname === '/mission' ? 'active' : ''}`}>
        <Trophy size={22} />
        <span>ภารกิจ</span>
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
      
      <Link to="/chat" className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}>
        <MessageCircle size={22} />
        <span>แชท</span>
      </Link>
    </div>
  );
};

export default BottomNavbar;