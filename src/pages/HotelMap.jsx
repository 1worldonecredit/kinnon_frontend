import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Search, Filter, SlidersHorizontal, 
  ArrowDownUp, ShoppingCart, Info, Star
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';

const HotelMap = () => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(true);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
      <TopNavbar />
      {/* ================= แผนที่จำลอง (Background) ================= */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundImage: 'url("https://maps.googleapis.com/maps/api/staticmap?center=16.634,100.999&zoom=13&size=600x800&maptype=roadmap&key=YOUR_API_KEY_HERE")', 
        backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 
      }}>
        {/* สีพื้นหลังเผื่อโหลดรูปไม่ขึ้น จะได้ดูเหมือนแผนที่ */}
        <div style={{ width: '100%', height: '100%', backgroundColor: '#e8ebd4' }}></div>
      </div>

      {/* ================= Header ด้านบน ================= */}
      <div style={{ position: 'relative', zIndex: 10, backgroundColor: '#fff', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', gap: '15px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0 }}>
            <ChevronLeft size={28} color="#333" />
          </button>
          
          <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Search size={18} color="#64748b" />
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Khao Kho (333)</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>พ. 30 ก.ย. - พฤ. 1 ต.ค. • 2 ผู้...</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>
              ฿
            </button>
            <button style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>

        {/* ตัวกรอง (Filter Tabs) */}
        <div style={{ display: 'flex', padding: '10px 20px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '13px', borderRight: '1px solid #e2e8f0' }}>
            <Filter size={16} /> ตัวกรอง
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 'bold', color: '#1e293b', borderRight: '1px solid #e2e8f0', borderBottom: '3px solid #f59e0b', paddingBottom: '5px' }}>
            ช่วงราคา<br/>ที่ต้องการ
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
            <ArrowDownUp size={16} /> เรียงผล
          </div>
        </div>
      </div>

      {/* ================= Pin บนแผนที่จำลอง (Mock Pins) ================= */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: 'calc(100vh - 120px)' }}>
        
        {/* Pin ราคา: ฿ 2,150 (ไร่บีเอ็น) */}
        <div style={{ position: 'absolute', top: '25%', left: '35%' }}>
           <div style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
             ฿ 2,150
           </div>
           <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#6366f1', fontWeight: 'bold', textAlign: 'center', textShadow: '1px 1px 0 #fff' }}>ไร่บี.เอ็น</p>
        </div>

        {/* Pin สีชมพู (ในสวนฝัน) */}
        <div style={{ position: 'absolute', top: '38%', left: '55%' }}>
           <p style={{ margin: '0 0 5px 0', fontSize: '11px', color: '#db2777', fontWeight: 'bold', textAlign: 'right', textShadow: '1px 1px 0 #fff' }}>ในสวนฝัน<br/>รีสอร์ท เขาค้อ</p>
           <div style={{ backgroundColor: '#db2777', color: '#fff', padding: '5px', borderRadius: '50%', width: '25px', height: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px solid #fff', float: 'right' }}>
             <Info size={14} />
           </div>
        </div>

        {/* Pin ราคา (กอไก่ แคมป์ปิ้ง) - ตัวที่กำลังเลือก (Active) */}
        <div style={{ position: 'absolute', bottom: '40%', left: '20%' }}>
           <div style={{ backgroundColor: '#fff', color: '#2563eb', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '16px', border: '2px solid #2563eb', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', position: 'relative' }}>
             ฿ 1,142
             {/* จุดสีฟ้าเล็กๆ */}
             <div style={{ position: 'absolute', top: '-5px', left: '-5px', fontSize: '10px', color: '#3b82f6' }}>Google</div>
           </div>
           <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#7e22ce', fontWeight: 'bold', textAlign: 'center', textShadow: '1px 1px 0 #fff' }}>จุดชมวิวทะเล<br/>หมอก อำเภอเขาค้อ</p>
        </div>
        
        {/* Pin จองเต็มแล้ว */}
        <div style={{ position: 'absolute', bottom: '45%', left: '45%' }}>
           <div style={{ backgroundColor: '#94a3b8', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', border: '2px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
             จองเต็มแล้ว
           </div>
        </div>
      </div>

      {/* ================= การ์ดรายละเอียดที่พัก (ด้านล่าง) ================= */}
      {showCard && (
        <div style={{ 
          position: 'absolute', bottom: '20px', left: '15px', right: '15px', zIndex: 20, 
          backgroundColor: '#fff', borderRadius: '16px', padding: '15px', display: 'flex', gap: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease-out'
        }}>
          
          {/* รูปภาพพรีวิว */}
          <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80" alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '4px', textAlign: 'center' }}>
              รูปภาพ 1/40
            </div>
          </div>

          {/* รายละเอียด */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>
                กอ ไก่ แคมป์ปิ้ง เขาค้อ รีสอร์ท
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', marginBottom: '8px' }}>
                <Star size={12} fill="#f59e0b" />
                <Star size={12} fill="#f59e0b" />
                <Star size={12} fill="#f59e0b" />
                <Star size={12} fill="#f59e0b" />
                <Star size={12} fill="#f59e0b" />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>9.1</span>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>ยอดเยี่ยม</span><br/>
                  100 รีวิว
                </div>
              </div>
            </div>

            {/* ราคา */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-block', backgroundColor: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginBottom: '2px' }}>
                -76%
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>฿ 4,799</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>1 คืน </span> 
                ฿ 1,142
              </div>
            </div>
          </div>
        </div>
      )}
    <BottomNavbar />
    </div>
  );
};

export default HotelMap;