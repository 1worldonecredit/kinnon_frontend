import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// นำเข้าไฟล์ใหม่
import HotelSearch from './pages/HotelSearch';
import HotelMap from './pages/HotelMap';
import Team from './pages/team';
import Wallet from './pages/Wallet';
import Shop from './pages/Shop';
import Media from './pages/Media';

function App() {
  return (
    <BrowserRouter>
      {/* ใช้ app-container เพื่อคุม Layout ให้เป็นไปตาม CSS ที่ตั้งไว้ */}
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hotels" element={<HotelSearch />} />
            <Route path="/hotel-map" element={<HotelMap />} />
            <Route path="/team" element={<Team />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/shop" element={<Shop />} />
             <Route path="/media" element={<Media />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;