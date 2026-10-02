import React, { useState, useEffect } from 'react';
// 🌟 1. เพิ่ม useSearchParams สำหรับอ่านค่าจาก URL
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, Search, Filter, ArrowDownUp, 
  ShoppingCart, Info, Star, MapPin
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';

const HotelMap = () => {
  const navigate = useNavigate();
  // 🌟 2. เรียกใช้งาน searchParams เพื่อดึงคำค้นหา
  const [searchParams] = useSearchParams();
  const searchLocation = searchParams.get('search') || 'ที่พักใกล้ฉัน';

  const [showCard, setShowCard] = useState(true);
  
  const [userLoc, setUserLoc] = useState({ lat: 13.7563, lng: 100.5018 }); // ค่าเริ่มต้น (กรุงเทพฯ)
  const [isLoadingLoc, setIsLoadingLoc] = useState(true);
  
  const [radiusKm, setRadiusKm] = useState(50); // ตั้งค่าเริ่มต้นที่ 50 กิโลเมตร
  const [zoom, setZoom] = useState(10); // ซูมระดับ 10 จะครอบคลุมพื้นที่ประมาณ 50 กม.

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

 // ดึงตำแหน่งของผู้ใช้งานเมื่อเปิดหน้านี้
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          
          setUserLoc({ lat: currentLat, lng: currentLng });
          setIsLoadingLoc(false);
          
          // ✅ ยิงพิกัดอัปเดตฐานข้อมูลเบื้องหลังทันทีที่ได้ค่ามา
          saveLocationToDB(currentLat, currentLng);
        },
        (error) => {
          console.warn("ไม่สามารถดึงตำแหน่งได้ จะแสดงแผนที่เริ่มต้นแทน"); 
          setIsLoadingLoc(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.warn("บราวเซอร์ของคุณไม่รองรับการค้นหาตำแหน่ง");
      setIsLoadingLoc(false);
    }
  }, []);

  // แปลงรัศมี (km) ให้เป็นระดับการซูมของ Google Maps คร่าวๆ
  useEffect(() => {
    if (radiusKm <= 5) setZoom(13);
    else if (radiusKm <= 20) setZoom(11);
    else if (radiusKm <= 50) setZoom(10);
    else if (radiusKm <= 100) setZoom(9);
    else setZoom(8);
  }, [radiusKm]);

  // สร้าง URL ของ Google Maps Static API (ปักหมุดสีแดงที่ตำแหน่งผู้ใช้)
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${userLoc.lat},${userLoc.lng}&zoom=${zoom}&size=600x800&maptype=roadmap&markers=color:red%7Clabel:Me%7C${userLoc.lat},${userLoc.lng}&key=${API_KEY}`;

 // เอาฟังก์ชันนี้ไว้ในคอมโพเนนต์ HotelMap เหมือนเดิม แต่รับค่าพิกัดเข้ามาโดยตรง
  const saveLocationToDB = async (lat, lng) => {
    try {
      await fetch('https://apibooking.smartsoft.agency/api/save-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1, 
          label: searchLocation, // คำค้นหา
          latitude: lat,
          longitude: lng
        })
      });
      // ✅ ไม่ต้องใส่ alert() ใดๆ ให้รบกวนผู้ใช้
    } catch (error) {
      console.error('Silent Error saving location:', error);
    }
  };

  return (
    <div className="app-container" style={{ backgroundColor: '#e2e8f0', position: 'relative' }}>
      <TopNavbar />
      
      {/* ================= แผนที่จำลอง (อยู่ด้านหลังสุดเต็มจอ) ================= */}
      <div style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundImage: `url("${mapUrl}")`, 
        backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 
      }}>
        {isLoadingLoc && (
          <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#1e293b' }}>
            📍 กำลังค้นหาตำแหน่งของคุณ...
          </div>
        )}
      </div>

      <div className="main-content" style={{ position: 'relative', zIndex: 1, padding: '70px 0 80px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* ================= Header ค้นหาและตัวกรอง ================= */}
        <div style={{ backgroundColor: '#fff', borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', gap: '15px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: 0 }}>
              <ChevronLeft size={28} color="#333" />
            </button>
            
            <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '10px 15px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Search size={18} color="#64748b" />
              <div>
                {/* 🌟 3. นำคำค้นหามาแสดงตรงนี้ ถ้าไม่ได้ค้นหาอะไรมา จะแสดงคำว่า "ที่พักใกล้ฉัน" */}
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>{searchLocation} (รัศมี {radiusKm} กม.)</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>อิงตามตำแหน่งปัจจุบันของคุณ</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>฿</button>
              <button style={{ width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', padding: '10px 20px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '13px', borderRight: '1px solid #e2e8f0' }}>
              <Filter size={16} /> ตัวกรอง
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: 'bold', color: '#1e293b', borderRight: '1px solid #e2e8f0', borderBottom: '3px solid #f59e0b', paddingBottom: '5px' }}>
              ช่วงราคา
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
              <ArrowDownUp size={16} /> เรียงผล
            </div>
          </div>
        </div>

        {/* พื้นที่ตรงกลางปล่อยว่างให้เห็นแผนที่ */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* ตัวอย่าง Pin บนแผนที่ */}
          <div style={{ position: 'absolute', bottom: '40%', left: '20%' }}>
             <div style={{ backgroundColor: '#fff', color: '#2563eb', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', fontSize: '16px', border: '2px solid #2563eb', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', position: 'relative' }}>
               ฿ 1,142
             </div>
             <p style={{ margin: '5px 0 0 0', fontSize: '11px', color: '#7e22ce', fontWeight: 'bold', textAlign: 'center', textShadow: '1px 1px 0 #fff' }}>ที่พักใกล้คุณ</p>
          </div>
        </div>

        {/* ================= การ์ดรายละเอียดที่พัก (ด้านล่าง) ================= */}
        {showCard && (
          <div style={{ 
            position: 'absolute', bottom: '80px', left: '15px', right: '15px', zIndex: 20, 
            backgroundColor: '#fff', borderRadius: '16px', padding: '15px', display: 'flex', gap: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)', animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80" alt="Hotel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '4px', textAlign: 'center' }}>รูปภาพ 1/40</div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>โรงแรมตัวอย่างใกล้ฉัน</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', marginBottom: '8px' }}>
                  <Star size={12} fill="#f59e0b" /><Star size={12} fill="#f59e0b" /><Star size={12} fill="#f59e0b" /><Star size={12} fill="#f59e0b" /><Star size={12} fill="#f59e0b" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>9.1</span>
                  <div style={{ fontSize: '11px', color: '#64748b' }}><span style={{ fontWeight: 'bold', color: '#333' }}>ยอดเยี่ยม</span><br/>100 รีวิว</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-block', backgroundColor: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', marginBottom: '2px' }}>-76%</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>฿ 4,799</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal' }}>1 คืน </span> ฿ 1,142
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default HotelMap;