import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, Calendar, User, 
  MapPin, Map as MapIcon
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';

const HotelSearch = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overnight');
  
  // 🌟 1. เพิ่ม State สำหรับเก็บค่าที่ผู้ใช้พิมพ์ค้นหา
  const [searchQuery, setSearchQuery] = useState('Khao Kho');

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', position: 'relative' }}>
      <TopNavbar />
      {/* Background สีชมพูไล่ระดับด้านบน */}
      <div style={{ 
        background: 'linear-gradient(180deg, #ffc0cb 0%, #f8fafc 100%)', 
        height: '250px', 
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        zIndex: 0 
      }}></div>

      <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
        
        {/* Header: ปุ่มกลับ และ ปุ่มตั้งค่าสกุลเงิน */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          >
            <ChevronLeft size={24} />
          </button>
          <button style={{ backgroundColor: '#fff', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <span>฿</span> THB
          </button>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
          ห้องพักทุกประเภท
        </h1>

        {/* Card ค้นหาหลัก */}
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '25px' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
            <div 
              onClick={() => setActiveTab('overnight')}
              style={{ flex: 1, textAlign: 'center', padding: '15px 0', fontWeight: 'bold', color: activeTab === 'overnight' ? '#2563eb' : '#64748b', borderBottom: activeTab === 'overnight' ? '3px solid #2563eb' : 'none', cursor: 'pointer' }}
            >
              พักข้ามคืน
            </div>
            <div 
              onClick={() => setActiveTab('hourly')}
              style={{ flex: 1, textAlign: 'center', padding: '15px 0', fontWeight: 'bold', color: activeTab === 'hourly' ? '#2563eb' : '#64748b', borderBottom: activeTab === 'hourly' ? '3px solid #2563eb' : 'none', cursor: 'pointer' }}
            >
              ที่พักรายชั่วโมง
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* สถานที่ */}
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
              <Search size={20} color="#64748b" style={{ marginRight: '10px' }} />
              {/* 🌟 2. ผูก State searchQuery เข้ากับช่อง input ให้พิมพ์แก้ได้จริง */}
              <input 
                type="text" 
                placeholder="ค้นหาสถานที่..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', flex: 1, fontSize: '16px', outline: 'none', fontWeight: '500' }}
              />
              <MapPin size={20} color="#000" />
            </div>

            {/* วันที่ */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px' }}>
                <Calendar size={20} color="#64748b" style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>พ. 30 ก.ย.</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px' }}>
                <Calendar size={20} color="#64748b" style={{ marginRight: '10px' }} />
                <span style={{ fontSize: '14px', fontWeight: '500' }}>พฤ. 01 ต.ค.</span>
              </div>
            </div>

            {/* จำนวนคน */}
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
              <User size={20} color="#64748b" style={{ marginRight: '10px' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>1 ห้อง ผู้ใหญ่ 2 คน เด็ก 0 คน</span>
            </div>

            {/* ตัวเลือกเพิ่มเติม */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <input type="checkbox" style={{ width: '20px', height: '20px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>⏰ ข้อเสนอเวลาจำกัดขึ้นก่อน</span>
              <span style={{ backgroundColor: '#b91c1c', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>ลดสูงสุด 20%</span>
            </div>

            {/* ปุ่มค้นหาและปุ่มดูแผนที่ */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* 🌟 3. แนบคำค้นหาไปกับ URL เมื่อผู้ใช้กดปุ่มแผนที่ */}
              <button 
                onClick={() => navigate(`/hotel-map?search=${encodeURIComponent(searchQuery)}`)}
                style={{ width: '50px', height: '50px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                <MapIcon size={24} color="#2563eb" />
              </button>
              <button style={{ flex: 1, backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold' }}>
                ดูราคา
              </button>
            </div>
          </div>
        </div>

        {/* ส่วนคูปอง */}
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>คูปองส่วนลด</h3>
        <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '15px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          
          <div style={{ backgroundColor: '#ef4444', color: '#fff', borderRadius: '12px', padding: '15px 10px', width: '80px', textAlign: 'center', position: 'relative' }}>
             <p style={{ margin: 0, fontSize: '10px', fontWeight: 'bold' }}>UP TO</p>
             <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>27<span style={{ fontSize: '12px' }}>%</span></h2>
             <p style={{ margin: 0, fontSize: '10px' }}>OFF</p>
             <div style={{ position: 'absolute', right: '-5px', top: '50%', transform: 'translateY(-50%)', width: '10px', height: '10px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
          </div>
          
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>ลดสูงสุด ฿3,300</h4>
            <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
              ส่วนลดจากดีลของอโกด้า • หมดอายุภายใน 3 วัน , มูลค่าการจองขั้นต่ำ ฿1,000
            </p>
            <button style={{ color: '#2563eb', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '14px', padding: 0 }}>
              เก็บคูปอง
            </button>
          </div>
        </div>

      </div>
      <BottomNavbar />
    </div>
  );
};

export default HotelSearch;