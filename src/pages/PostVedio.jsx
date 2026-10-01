import React from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
// 🌟 นำเข้าไอคอน PlaySquare ให้ตรงกับเรื่องวิดีโอ
import { PlaySquare } from "lucide-react";

const PostVedio = () => {
  return (
    <div className="app-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <TopNavbar />
      
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          {/* 🌟 เปลี่ยนมาใช้ไอคอน PlaySquare */}
          <PlaySquare size={64} color="#00e5ff" style={{ marginBottom: '20px', margin: '0 auto' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>โพสต์วิดีโอ</h1>
          <p style={{ color: '#64748b' }}>พบกับหน้า โพสต์วิดีโอ เร็วๆ นี้...</p>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default PostVedio;