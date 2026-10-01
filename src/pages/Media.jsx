import React, { useState, useEffect, useRef } from 'react';
import TopNavbar from '../components/TopNavbar'; 
import { Zap, Gift, PlayCircle, Share2, WifiOff, Users, Clock, Briefcase, Heart, MessageCircle, Eye, Maximize, Minimize, UserPlus, CheckCircle2 } from 'lucide-react';
import BottomNavbar from '../components/BottomNavbar';
const API_URL = import.meta.env.VITE_API_URL || 'https://apibooking.smartsoft.agency';

const useNetworkStatus = () => {
  const [isSlow, setIsSlow] = useState(false);
  useEffect(() => {
    if ('connection' in navigator) {
      const conn = navigator.connection;
      if (conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.saveData) {
        setIsSlow(true);
      }
    }
  }, []);
  return isSlow;
};

// 🌟 AdPlayer Component
const AdPlayer = ({ ad, isMain, onSelect, isSlowNet, userData }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(ad.is_liked || false);
  const [likesCount, setLikesCount] = useState(ad.likes_count || 0);
  const [viewsCount, setViewsCount] = useState(ad.views_count || 0);
  const [sharesCount, setSharesCount] = useState(ad.shares_count || 0);
  const [hasViewed, setHasViewed] = useState(false); 
  
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);

  const [isFollowing, setIsFollowing] = useState(() => {
    return localStorage.getItem('salapi_is_following_ad') === 'true';
  });
  const [followersCount, setFollowersCount] = useState(() => {
    const savedCount = localStorage.getItem('salapi_followers_count_ad');
    return savedCount ? parseInt(savedCount, 10) : 319;
  });

  useEffect(() => {
    let isMounted = true;
    setIsLiked(ad.is_liked || false);
    setLikesCount(ad.likes_count || 0);
    setViewsCount(ad.views_count || 0);
    setSharesCount(ad.shares_count || 0);
    return () => { isMounted = false; };
  }, [ad, isMain, isSlowNet]);

  const handleMediaLoaded = (e) => {
    const w = e.target.videoWidth || e.target.naturalWidth || 0;
    const h = e.target.videoHeight || e.target.naturalHeight || 0;
    if (w > 0 && h > 0) setIsPortrait(h >= w);
  };

  const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
      return num;
  };

  // 🔥 จัดการการคลิกที่จอ: ถ้าเต็มจอให้ย่อกลับ ถ้าปกติให้เล่น/หยุด
  const handleVideoClick = (e) => {
    e.stopPropagation(); 
    if (isFullScreen) {
      setIsFullScreen(false); // ออกจากเต็มจอ
    } else {
      if (videoRef.current) {
        if (isPlaying) {
           videoRef.current.pause();
        } else {
           videoRef.current.muted = false; 
           videoRef.current.play();
           if (!hasViewed) {
               setHasViewed(true);
               setViewsCount(prev => prev + 1);
               fetch(`${API_URL}/api/video/view`, {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ video_id: ad.ad_id })
               });
           }
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const handleLike = async (e) => {
      e.stopPropagation();
      if (!userData) return alert('กรุณาเข้าสู่ระบบก่อนกดถูกใจครับ');
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      setLikesCount(prev => newIsLiked ? prev + 1 : Math.max(0, prev - 1));
      try {
          await fetch(`${API_URL}/api/video/like`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ video_id: ad.ad_id, username: userData.username })
          });
      } catch (err) {
          setIsLiked(!newIsLiked);
          setLikesCount(prev => !newIsLiked ? prev + 1 : Math.max(0, prev - 1));
      }
  };
  
  const handleShare = async (e) => {
      e.stopPropagation();
      if (navigator.share) {
          try {
              const shareText = `🎯 ${ad.title}\n📝 ${ad.description}`;
              await navigator.share({ title: ad.title, text: shareText, url: window.location.href });
              setSharesCount(prev => prev + 1);
              fetch(`${API_URL}/api/video/share`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ video_id: ad.ad_id, username: userData ? userData.username : null })
             });
          } catch (err) {}
      } else { alert('บราวเซอร์ของคุณไม่รองรับการแชร์โดยตรงครับ'); }
  };

  const handleFollow = (e) => {
      e.stopPropagation();
      if (!userData) return alert('🔒 กรุณาเข้าสู่ระบบก่อนติดตามครับ!');
      const newStatus = !isFollowing;
      const newCount = newStatus ? followersCount + 1 : followersCount - 1;
      setIsFollowing(newStatus);
      setFollowersCount(newCount);
      localStorage.setItem('salapi_is_following_ad', newStatus);
      localStorage.setItem('salapi_followers_count_ad', newCount);
  };

  if (isMain) {
      return (
          <div className={isFullScreen ? "fullscreen-mode" : "main-video-container"} onClick={handleVideoClick}>
              <TopNavbar />
              <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'rgba(239,68,68,0.9)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
                <PlayCircle size={14} color="white" /> <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{formatNumber(viewsCount)} วิว</span>
              </div>
              
              {/* 🔥 ปุ่มย่อ/ขยายจอ อัจฉริยะ (แสดง Minimize เสมอเมื่อเต็มจอ) */}
              <button 
                className={`fullscreen-toggle-btn ${(!isFullScreen && isPortrait) ? 'hide-on-pc' : ''}`}
                onClick={(e) => { e.stopPropagation(); setIsFullScreen(!isFullScreen); }} 
                style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(0,0,0,0.6)', border: '1.5px solid rgba(255,255,255,0.4)', padding: '8px', borderRadius: '8px', color: 'white', zIndex: 99999, cursor: 'pointer', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
              >
                {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>

              {isSlowNet && (
                <div style={{ position: 'absolute', top: '15px', left: '110px', backgroundColor: 'rgba(245, 158, 11, 0.9)', padding: '6px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 10 }}>
                  <WifiOff size={12} color="white" /> <span style={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}>เน็ตช้า</span>
                </div>
              )}

              {ad.media_type === 'video' ? (
                <>
                  <video 
                    ref={videoRef} 
                    src={ad.media_url} 
                    poster={ad.thumbnail_url || `${ad.media_url}#t=0.5`} 
                    playsInline 
                    loop 
                    onEnded={() => setIsPlaying(false)} 
                    onLoadedMetadata={handleMediaLoaded} 
                    preload={isSlowNet ? "none" : "auto"} 
                    className="video-element"
                    style={{ objectFit: isFullScreen ? 'contain' : 'cover' }} 
                  />
                  {!isPlaying && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '12px', border: '1.5px solid rgba(255,255,255,0.8)', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlayCircle size={35} color="white" />
                    </div>
                  )}
                </>
              ) : ( 
                <img src={ad.media_url} alt="Ads" className="video-element" onLoad={handleMediaLoaded} style={{ objectFit: isFullScreen ? 'contain' : 'cover' }} /> 
              )}

              {/* UI ฝั่งขวา */}
              <div style={{ position: 'absolute', bottom: '130px', right: '15px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', zIndex: 30 }}>
                  <div onClick={handleLike} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                      <Heart size={26} color={isLiked ? "#ef4444" : "white"} fill={isLiked ? "#ef4444" : "transparent"} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))', transition: '0.2s' }} />
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.8)', marginTop: '3px' }}>{formatNumber(likesCount)}</span>
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); if (!userData) return alert('🔒 กรุณาเข้าสู่ระบบก่อนคอมเมนต์ครับ!'); alert('💬 ระบบคอมเมนต์กำลังพัฒนาครับเจ้านาย!'); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                      <MessageCircle size={26} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.8)', marginTop: '3px' }}>{formatNumber(ad.comments_count || 0)}</span>
                  </div>
                  <div onClick={handleShare} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                      <Share2 size={26} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.8)', marginTop: '3px' }}>{formatNumber(sharesCount)}</span>
                  </div>
              </div>
              
              {/* Profile & ข้อมูลด้านล่าง */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)', padding: '40px 15px 20px 15px', zIndex: 5, pointerEvents: 'none', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', pointerEvents: 'auto', width: '100%', paddingRight: '45px', boxSizing: 'border-box' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid white', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', flexShrink: 0 }}>
                        <img src={`https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&size=100`} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <strong style={{ color: 'white', fontSize: '13px', textShadow: '0 1px 2px rgba(0,0,0,0.8)', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>SALAPI ADMIN</strong>
                        <span style={{ color: '#cbd5e1', fontSize: '10px', textShadow: '0 1px 2px rgba(0,0,0,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ผู้ติดตาม {formatNumber(followersCount)} คน</span>
                    </div>
                    <button 
                        onClick={handleFollow}
                        style={{ flexShrink: 0, marginLeft: 'auto', backgroundColor: isFollowing ? 'rgba(255,255,255,0.2)' : '#ef4444', color: 'white', border: isFollowing ? '1px solid white' : 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', transition: '0.2s' }}
                    >
                        {isFollowing ? <><CheckCircle2 size={12}/> ติดตามแล้ว</> : <><UserPlus size={12}/> ติดตาม</>}
                    </button>
                </div>
                <h4 style={{ color: 'white', margin: '0 0 5px 0', fontSize: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '85%', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{ad.title}</h4>
                <p style={{ color: '#cbd5e1', margin: 0, fontSize: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', width: '85%', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>{ad.description}</p>
              </div>
          </div>
      );
  } else {
      return (
          <div onClick={() => onSelect(ad)} style={{ display: 'flex', gap: '15px', marginBottom: '15px', backgroundColor: 'white', padding: '10px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s' }} className="video-list-item">
              <div style={{ width: '140px', height: '80px', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#000', position: 'relative', flexShrink: 0 }}>
                  <img src={ad.thumbnail_url || `${ad.media_url}#t=0.5`} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 20 }}>
                    <PlayCircle size={28} color="rgba(255,255,255,0.9)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                  </div>
                  <div style={{ position: 'absolute', bottom: '5px', right: '5px', backgroundColor: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', color: 'white', fontSize: '10px', fontWeight: 'bold' }}>
                      9:16
                  </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h5 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>{ad.title}</h5>
                  <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '12px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ad.description}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Eye size={14}/> {formatNumber(ad.views_count || 0)}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Heart size={14} color={ad.is_liked ? '#ef4444' : '#94a3b8'} fill={ad.is_liked ? '#ef4444' : 'transparent'}/> {formatNumber(ad.likes_count || 0)}</span>
                  </div>
              </div>
          </div>
      );
  }
};

// ===============================================

const Media = () => {
  const isLoggedIn = !!localStorage.getItem('userData');
  const [activePromo, setActivePromo] = useState(null);
  const [promoCountdown, setPromoCountdown] = useState('');
  const [adsList, setAdsList] = useState([]);
  const [currentMainAd, setCurrentMainAd] = useState(null);
  const isSlowNetwork = useNetworkStatus();

  const [jobAd, setJobAd] = useState(null);
  const [jobCountdown, setJobCountdown] = useState('');
  const [isJobExpired, setIsJobExpired] = useState(false);

  const fetchAdsData = async () => {
    try {
      const storedUser = localStorage.getItem('userData');
      let usernameQuery = '';
      if (storedUser) {
          const userObj = JSON.parse(storedUser);
          usernameQuery = `?username=${userObj.username}`;
      }
     // const res = await fetch(`${API_URL}/api/video-promotions${usernameQuery}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.ads.length > 0) {
        setAdsList(data.ads);
        setCurrentMainAd(data.ads[0]); 
      }
    } catch (err) {}
  };

  const fetchBoardData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/p2p/board?user_id=0`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) { setActivePromo(data.activePromo); }
    } catch (err) {}
  };

//   const fetchJobAdData = async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/hrm/job-ad`);
//       const data = await res.json();
//       if (data.success && data.ad && data.ad.is_active) { setJobAd(data.ad); }
//     } catch (err) {}
//   };

  useEffect(() => {
    fetchAdsData(); fetchBoardData(); fetchJobAdData(); 
  }, []);

  useEffect(() => {
    if (!activePromo || !activePromo.end_time) return;
    const timer = setInterval(() => {
      const distance = new Date(activePromo.end_time).getTime() - new Date().getTime();
      if (distance < 0) { setPromoCountdown('หมดเวลา'); clearInterval(timer); 
      } else {
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        setPromoCountdown(`${d > 0 ? d + 'วัน ' : ''}${h}ชม. ${m}น. ${s}วิ.`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activePromo]);

  useEffect(() => {
    if (!jobAd) return;
    if (!jobAd.end_time) {
        setJobCountdown('เปิดรับสมัครอยู่');
        return;
    }
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(jobAd.end_time).getTime();
        const distance = end - now;

        if (distance < 0) {
            setJobCountdown('หมดเวลารับสมัคร');
            setIsJobExpired(true);
            clearInterval(timer);
        } else {
            const d = Math.floor(distance / (1000 * 60 * 60 * 24));
            const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);
            
            let timeStr = '';
            if(d > 0) timeStr += `${d} วัน `;
            timeStr += `${h} ชม. ${m} น. ${s} วิ.`;
            setJobCountdown(timeStr);
        }
    }, 1000);
    return () => clearInterval(timer);
  }, [jobAd]);

  const storedUser = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
// 🌟 เพิ่มตัวแปรนี้ด้านบน (ก่อน return) เพื่อเช็คสถานะล็อกอิน
 

  return (
    <div className="app-root">
      
      {/* 🌟 1. แสดง TopNavbar เฉพาะตอนยัง "ไม่ได้ล็อกอิน" */}
      {!isLoggedIn && <TopNavbar />}

      <div className="main-layout">
        
        <div className="video-viewport">
          {currentMainAd ? (
             <AdPlayer ad={currentMainAd} isMain={true} isSlowNet={isSlowNetwork} userData={storedUser} />
          ) : (
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                 กำลังโหลดวิดีโอ...
             </div>
          )}
        </div>

        <div className="content-sidebar">
            <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {jobAd && !isJobExpired && (
                    <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '12px', padding: '15px', color: 'white', boxShadow: '0 8px 20px -5px rgba(245, 158, 11, 0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Briefcase size={18} /> <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{jobAd.title}</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', opacity: 0.9, lineHeight: '1.4' }}>{jobAd.description}</p>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', fontSize: '11px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Clock size={14} /> <span style={{ fontWeight: 'bold' }}>{jobCountdown}</span>
                        </div>
                    </div>
                )}

                {activePromo && (
                    <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '12px', padding: '15px', color: 'white', boxShadow: '0 8px 20px -5px rgba(59, 130, 246, 0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Gift size={18} /> <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{activePromo.title}</span>
                        </div>
                        <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            +{activePromo.bonus_percent}%
                        </div>
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', fontSize: '11px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                            <Clock size={14} /> <span style={{ fontWeight: 'bold' }}>{promoCountdown}</span>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ padding: '0 15px 40px 15px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                  <PlayCircle size={20} color="#ef4444" /> วิดีโอแนะนำ
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {adsList.length > 0 ? (
                        adsList.map(ad => {
                        if (currentMainAd && ad.ad_id === currentMainAd.ad_id) return null; 
                        return ( 
                            <AdPlayer key={ad.ad_id} ad={ad} isMain={false} isSlowNet={isSlowNetwork} userData={storedUser} onSelect={(selectedAd) => setCurrentMainAd(selectedAd)} /> 
                        )
                        })
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px' }}>
                            กำลังโหลดวิดีโอ...
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* 🌟 2. แสดง BottomNavbar เฉพาะตอน "ล็อกอินแล้ว" */}
      {isLoggedIn && <BottomNavbar />}

      <style>{`
        /* 🔥 รักษาโครงสร้างล็อคจอ 100% ไม่พังแน่นอน */
        body { margin: 0; padding: 0; overflow: hidden; }
        
        .app-root {
            display: flex;
            flex-direction: column;
            height: 100vh; 
            height: 100dvh; 
            background-color: #f8fafc;
            font-family: 'Prompt', sans-serif;
            /* เพิ่ม relative เผื่อให้ Navbar จับเกาะได้ */
            position: relative;
        }

        .main-layout {
            flex: 1; 
            display: flex;
            overflow: hidden; 
            background-color: #0f172a;
        }

        .main-video-container {
            position: relative;
            background-color: #000;
        }

        .video-element {
            width: 100%;
            height: 100%;
            object-fit: cover; 
            display: block;
        }

        .video-list-item:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.08); }

        /* 💻 คอมพิวเตอร์ */
        @media (min-width: 900px) {
            .app-root { height: 100vh; overflow: hidden; }
            .main-layout { display: flex; flex-direction: row; height: calc(100vh - 60px); }
            .video-viewport {
                flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: #000;
            }
            .main-video-container { 
                height: 100%; aspect-ratio: 9/16; box-shadow: 0 0 40px rgba(0,0,0,0.5); border-radius: 16px; overflow: hidden; 
            }
            .content-sidebar { width: 450px; background-color: #f8fafc; overflow-y: auto; border-left: 1px solid #e2e8f0; }

            /* ซ่อนปุ่มถ้าคอมเปิด 9:16 */
            .hide-on-pc { display: none !important; }
        }

        /* 📱 มือถือ (ไถได้แน่นอน 100% เพราะแยกโซนชัดเจน) */
        @media (max-width: 899px) {
            .app-root { height: 100vh; height: 100dvh; overflow: hidden; }
            .main-layout { display: flex; flex-direction: column; width: 100%; height: calc(100vh - 60px); height: calc(100dvh - 60px); }
            
            .video-viewport { 
                width: 100%; 
                height: 55%; /* ล็อควิดีโอไว้ที่ 55% ของจอ */
                flex-shrink: 0;
                background-color: #000; 
                position: relative;
                z-index: 10;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .main-video-container { width: 100%; height: 100%; }
            
            .content-sidebar {
                width: 100%;
                height: 45%; /* ลิสต์อยู่ 45% ล่าง */
                flex-grow: 1;
                overflow-y: auto; /* 🔥 คำสั่งศักดิ์สิทธิ์ที่ทำให้ไถรายการล่างได้ */
                -webkit-overflow-scrolling: touch; /* ให้ไถลื่นใน iOS */
                background-color: #f8fafc; 
                padding-bottom: 20px;
            }
        }

        /* 🌟 โหมด Fullscreen */
        .fullscreen-mode {
            position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            width: 100vw !important; height: 100vh !important; height: 100dvh !important; max-width: 100% !important; max-height: 100% !important;
            margin: 0 !important; border-radius: 0 !important; z-index: 99999 !important; background: #000 !important;
            display: flex !important; justify-content: center !important; align-items: center !important;
        }

        .content-sidebar::-webkit-scrollbar { width: 4px; }
        .content-sidebar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Media;