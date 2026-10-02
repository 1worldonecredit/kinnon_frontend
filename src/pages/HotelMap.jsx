import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, Search, Filter, ArrowDownUp, 
  ShoppingCart, Star
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';

// 🌟 ฟังก์ชันคำนวณระยะทาง
const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
};

const HotelMap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchLocation = searchParams.get('search') || 'ที่พักใกล้ฉัน';

  const [showCard, setShowCard] = useState(true);
  const [userLoc, setUserLoc] = useState({ lat: 13.7563, lng: 100.5018 }); 
  const [isLoadingLoc, setIsLoadingLoc] = useState(true);
  const [radiusKm, setRadiusKm] = useState(null); 
  const [zoom, setZoom] = useState(10); 

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const currentLat = position.coords.latitude;
          const currentLng = position.coords.longitude;
          
          setUserLoc({ lat: currentLat, lng: currentLng });
          
          try {
            const res = await fetch('https://apibooking.smartsoft.agency/api/get-display-radius', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lat: currentLat, lng: currentLng })
            });
            const data = await res.json();
            setRadiusKm(data.radius); 
          } catch (err) {
            setRadiusKm(50); 
          }
          setIsLoadingLoc(false);
        },
        (error) => { 
          console.warn("ไม่สามารถดึงตำแหน่งได้ จะแสดงแผนที่เริ่มต้นแทน"); 
          setRadiusKm(50);
          setIsLoadingLoc(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      console.warn("บราวเซอร์ของคุณไม่รองรับ");
      setRadiusKm(50);
      setIsLoadingLoc(false);
    }
  }, []);

  useEffect(() => {
    if (radiusKm === null) return; 
    if (radiusKm <= 5) setZoom(13);
    else if (radiusKm <= 20) setZoom(11);
    else if (radiusKm <= 50) setZoom(10);
    else if (radiusKm <= 100) setZoom(9);
    else setZoom(8);
  }, [radiusKm]);

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${userLoc.lat},${userLoc.lng}&zoom=${zoom}&size=600x800&maptype=roadmap&markers=color:red%7Clabel:Me%7C${userLoc.lat},${userLoc.lng}&key=${API_KEY}`;
  console.log("MAP URL:", mapUrl);

  const handleHotelClick = async () => {
    if (userLoc.lat && userLoc.lng) {
      const today = new Date().toLocaleDateString('en-GB');
      const savedData = JSON.parse(localStorage.getItem('lastSavedLoc') || '{}');
      let shouldSave = false;

      if (savedData.date !== today) {
        shouldSave = true; 
      } else {
        const distance = getDistanceInKm(userLoc.lat, userLoc.lng, savedData.lat, savedData.lng);
        if (distance > 5) shouldSave = true; 
      }

      if (shouldSave) {
        try {
          await fetch('https://apibooking.smartsoft.agency/api/save-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: 1, 
              label: searchLocation, 
              latitude: userLoc.lat,
              longitude: userLoc.lng
            })
          });
          localStorage.setItem('lastSavedLoc', JSON.stringify({ date: today, lat: userLoc.lat, lng: userLoc.lng }));
        } catch (error) {
          console.error('Silent Error:', error);
        }
      }
    }
    console.log("เปิดดูรายละเอียดโรงแรม...");
  };

  return (
    <div className="app-container bg-slate-200">
      <TopNavbar />
      
      {/* ================= แผนที่ ================= */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url("${mapUrl}")` }}
      >
        {isLoadingLoc && (
          <div className="w-full h-full bg-white/70 flex justify-center items-center font-bold text-slate-800">
            📍 กำลังค้นหาตำแหน่งของคุณ...
          </div>
        )}
      </div>

      <div className="main-content flex flex-col h-full relative z-10 !pt-[70px] !pb-[80px]">
        
        {/* ================= Header ================= */}
        <div className="bg-white rounded-b-2xl shadow-md">
          <div className="flex items-center p-4 gap-4">
            <button onClick={() => navigate(-1)} className="bg-transparent border-none p-0">
              <ChevronLeft size={28} className="text-gray-800" />
            </button>
            
            <div className="flex-1 bg-slate-100 px-4 py-2 rounded-full flex items-center gap-3">
              <Search size={18} className="text-slate-500" />
              <div>
                <p className="m-0 text-sm font-bold">
                  {searchLocation} {radiusKm !== null ? `(รัศมี ${radiusKm} กม.)` : ''}
                </p>
                <p className="m-0 text-[11px] text-slate-500">อิงตามตำแหน่งปัจจุบันของคุณ</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-slate-100 border-none flex justify-center items-center font-bold">฿</button>
              <button className="w-9 h-9 rounded-full bg-slate-100 border-none flex justify-center items-center">
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>

          <div className="flex px-5 py-2.5 border-t border-slate-100">
            <div className="flex-1 flex justify-center items-center gap-1.5 text-[13px] border-r border-slate-200">
              <Filter size={16} /> ตัวกรอง
            </div>
            <div className="flex-1 flex justify-center items-center gap-1.5 text-[13px] font-bold text-slate-800 border-r border-slate-200 border-b-[3px] border-amber-500 pb-1">
              ช่วงราคา
            </div>
            <div className="flex-1 flex justify-center items-center gap-1.5 text-[13px]">
              <ArrowDownUp size={16} /> เรียงผล
            </div>
          </div>
        </div>

        {/* ================= Pin ================= */}
        <div className="flex-1 relative">
          <div className="absolute bottom-[40%] left-[20%]">
             <div className="bg-white text-blue-600 px-4 py-2 rounded-full font-bold text-base border-2 border-blue-600 shadow-lg relative">
               ฿ 1,142
             </div>
             <p className="m-0 mt-1 text-[11px] text-purple-700 font-bold text-center drop-shadow-[1px_1px_0_white]">ที่พักใกล้คุณ</p>
          </div>
        </div>

        {/* ================= การ์ดโรงแรม ================= */}
        {showCard && (
          <div 
            onClick={handleHotelClick} 
            className="absolute bottom-[80px] left-4 right-4 z-20 bg-white rounded-2xl p-4 flex gap-4 shadow-xl cursor-pointer animate-[slideUp_0.3s_ease-out]"
          >
            <div className="w-[100px] h-[100px] rounded-xl overflow-hidden relative shrink-0">
              <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&q=80" alt="Hotel" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 text-center">รูปภาพ 1/40</div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="m-0 mb-1 text-[15px] font-bold text-slate-800">โรงแรมตัวอย่างใกล้ฉัน</h3>
                <div className="flex items-center gap-0.5 text-amber-500 mb-2">
                  <Star size={12} className="fill-amber-500" /><Star size={12} className="fill-amber-500" /><Star size={12} className="fill-amber-500" /><Star size={12} className="fill-amber-500" /><Star size={12} className="fill-amber-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">9.1</span>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    <span className="font-bold text-gray-800">ยอดเยี่ยม</span><br/>100 รีวิว
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] mb-0.5">-76%</div>
                <div className="text-[11px] text-slate-400 line-through">฿ 4,799</div>
                <div className="text-lg font-bold text-red-600">
                  <span className="text-[12px] text-slate-500 font-normal">1 คืน </span> ฿ 1,142
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