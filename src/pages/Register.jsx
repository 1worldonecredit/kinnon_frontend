import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Globe, UserPlus, User, Lock } from 'lucide-react'; 
//import TopNavbar from '../components/TopNavbar';

const API_URL = import.meta.env.VITE_API_URL || 'https://apibooking.smartsoft.agency';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [searchParams] = useSearchParams();
  const refParam = searchParams.get('ref');
  
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    referrer: refParam || '', 
    country: 'Thailand' 
  });
  
  const [userStatus, setUserStatus] = useState(''); 
  const [referrerName, setReferrerName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [langWarning, setLangWarning] = useState({ username: false, referrer: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsStandalone(true);
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleAndroidInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setDeferredPrompt(null);
    } else {
      alert('คุณสามารถติดตั้งแอปได้โดยกดเมนู (3 จุด) ที่มุมขวาบน แล้วเลือก "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก" ครับ');
    }
  };

  const handleEnglishOnly = (e, field) => {
    if (field === 'referrer' && refParam) return; 

    const originalValue = e.target.value;
    const filteredValue = originalValue.replace(/[^a-zA-Z0-9]/g, ''); 

    if (originalValue !== filteredValue) {
      setLangWarning({ ...langWarning, [field]: true });
      setTimeout(() => {
        setLangWarning((prev) => ({ ...prev, [field]: false }));
      }, 3000);
    }
    setFormData({ ...formData, [field]: filteredValue });
  };

  useEffect(() => {
    if (formData.username.length > 2) {
      setUserStatus('checking');
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/api/check-username/${formData.username}`);
          const data = await response.json();
          if (data.available) {
            setUserStatus('available');
          } else {
            setUserStatus('taken');
          }
        } catch (error) {
          setUserStatus('');
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setUserStatus('');
    }
  }, [formData.username]);

  useEffect(() => {
    if (formData.referrer.length > 2) {
      setReferrerName(t('checking', 'กำลังตรวจสอบ...'));
      const timer = setTimeout(async () => {
        try {
          const response = await fetch(`${API_URL}/api/check-referrer/${formData.referrer}`);
          const data = await response.json();
          if (data.exists) {
            setReferrerName(data.fullName);
          } else {
            setReferrerName(t('notFound', 'ไม่พบผู้แนะนำ'));
          }
        } catch (error) {
          setReferrerName(t('notFound', 'ไม่พบผู้แนะนำ'));
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setReferrerName('');
    }
  }, [formData.referrer, t]);

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('🎉 สมัครสมาชิกสำเร็จ! ระบบจะพาท่านไปหน้าเข้าสู่ระบบ');
        navigate('/login'); 
      } else {
        alert(`❌ ผิดพลาด: ${data.message}`);
      }
    } catch (error) {
      alert('❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className="cyber-hex-bg">
      {/* <TopNavbar /> */}
      
      <div className="main-content" style={{ maxWidth: '450px', margin: '0 auto', padding: '20px' }}>

        {!isStandalone && (
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0, 240, 255, 0.3)', marginBottom: '25px', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#ffffff', fontSize: '15px' }}>📱 ติดตั้งแอปพลิเคชัน กินนอน</h4>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px' }}>เพื่อการใช้งานที่รวดเร็วและสะดวกยิ่งขึ้น</p>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={handleAndroidInstall}
                style={{ flex: 1, padding: '10px', backgroundColor: 'rgba(22, 163, 74, 0.2)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
              >
                 🤖 Android
              </button>
              <button 
                onClick={() => setShowIOSGuide(!showIOSGuide)}
                style={{ flex: 1, padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
              >
                 🍎 iOS (iPhone)
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', paddingBottom: '40px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '25px', fontSize: '20px' }}>
            {t('register', 'ลงทะเบียน')}
          </h2>
          
          <form className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* เลือกประเทศ */}
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '12px', color: '#ffffff' }}>
                <Globe size={16} color="#00e5ff" />
                {t('selectCountry', 'เลือกประเทศ / Select Country')}
              </label>
              <select 
                className="cyber-input"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              >
                <option style={{backgroundColor: '#051017', color: '#fff'}} value="Thailand">🇹🇭 {t('countryTH', 'ประเทศไทย (THB)')}</option>
                <option style={{backgroundColor: '#051017', color: '#fff'}} value="Laos">🇱🇦 {t('countryLA', 'ສປປ ລາວ (LAK)')}</option>
              </select>
            </div>

            {/* ข้อมูลผู้แนะนำ */}
            <div style={{ border: '1px solid rgba(0,229,255,0.4)', borderRadius: '12px', padding: '15px', backgroundColor: 'rgba(0,0,0,0.3)', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ffffff', marginBottom: '10px' }}>
                <UserPlus size={16} color="#00e5ff" /> 
                {t('referrer', 'ชื่อผู้ใช้ของผู้แนะนำ')}
              </label>
              
              <div style={{ position: 'relative' }}>
                <UserPlus size={16} color="#00e5ff" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className="cyber-input"
                  style={{ 
                    paddingLeft: '38px',
                    borderColor: refParam ? 'rgba(255,255,255,0.2)' : '#00e5ff',
                    color: refParam ? '#94a3b8' : '#ffffff'
                  }} 
                  type="text" 
                  placeholder="Username ผู้แนะนำ (ถ้ามี)..."
                  value={formData.referrer}
                  readOnly={!!refParam}
                  onChange={(e) => handleEnglishOnly(e, 'referrer')}
                />
              </div>

              <input 
                className="cyber-input"
                style={{ marginTop: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)', fontSize: '12px' }}
                type="text" 
                value={referrerName} 
                readOnly 
                placeholder={t('referrerFullName', 'ชื่อ-นามสกุล ผู้แนะนำจะแสดงที่นี่')}
              />
            </div>

            {/* ชื่อผู้ใช้ของคุณ */}
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ffffff' }}>
                ตั้งชื่อผู้ใช้ของคุณ
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#00e5ff" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className="cyber-input"
                  style={{ paddingLeft: '38px' }}
                  type="text" 
                  placeholder={t('newUsername', 'เช่น john123')}
                  value={formData.username}
                  onChange={(e) => handleEnglishOnly(e, 'username')}
                  maxLength={20} 
                />
              </div>
              <div className="status-text" style={{ marginTop: '5px', fontSize: '12px' }}>
                {userStatus === 'checking' && <span style={{color: '#94a3b8'}}>⏳ {t('checking', 'กำลังตรวจสอบ...')}</span>}
                {userStatus === 'available' && <span style={{color: '#4ade80'}}>✅ {t('available', 'สามารถใช้ได้')}</span>}
                {userStatus === 'taken' && <span style={{color: '#f87171'}}>❌ {t('notAvailable', 'ชื่อนี้ถูกใช้แล้ว')}</span>}
              </div>
            </div>

            {/* รหัสผ่าน */}
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ffffff' }}>
                รหัสผ่าน
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#00e5ff" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  className="cyber-input" 
                  style={{ paddingLeft: '38px', paddingRight: '45px' }} 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t('password', 'รหัสผ่าน')} 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  maxLength={50}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* ปุ่มยืนยัน */}
            <button 
              className="cyber-btn" 
              type="button" 
              style={{ marginTop: '15px' }}
              disabled={userStatus === 'taken' || formData.username.length < 3 || formData.password.length < 6 || isSubmitting}
              onClick={handleRegister} 
            >
              {isSubmitting ? 'กำลังบันทึกข้อมูล...' : t('registerBtn', 'ยืนยันการลงทะเบียน')}
            </button>
          </form>
          
          <p style={{ marginTop: '30px', fontSize: '13px', color: '#ffffff' }}>
            {t('alreadyMember', 'เป็นสมาชิกอยู่แล้ว?')} <Link to="/login" style={{ color: '#00e5ff', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'none' }}>{t('loginHere', 'เข้าสู่ระบบที่นี่')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;