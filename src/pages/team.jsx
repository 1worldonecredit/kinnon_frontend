import React, { useState, useEffect } from 'react';
import TopNavbar from '../components/TopNavbar';
import BottomNavbar from '../components/BottomNavbar';
import { Users, Calendar, ShoppingBag, Trophy, ChevronRight, UserPlus, Wallet, Clock } from 'lucide-react';


const API_URL = import.meta.env.VITE_API_URL || 'https://apibooking.smartsoft.agency';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeThisMonth, setIncomeThisMonth] = useState(0);
  const [incomeToday, setIncomeToday] = useState(0); 
  const [isLoading, setIsLoading] = useState(true);
  const [myUsername, setMyUsername] = useState(''); 
  const [userCurrency, setUserCurrency] = useState('THB'); 

  const [commRates, setCommRates] = useState({ purchase: 2, win: 2, bonus: 1 });
  
  const [activeTab, setActiveTab] = useState('all'); // 🌟 เริ่มต้นที่ สมาชิกทั้งหมด

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const storedUser = localStorage.getItem('userData');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);
        const uid = user.id || user.user_id;
        setUserCurrency(user.currency_code || 'THB'); 

        const res = await fetch(`${API_URL}/api/my-team/${uid}`);
        const data = await res.json();

        if (data.success) {
          setMyUsername(data.myUsername);
          
          if (data.commSettings) {
            setCommRates({
              purchase: data.commSettings.purchase_percent,
              win: data.commSettings.win_percent,
              bonus: data.commSettings.daily_bonus_percent
            });
          }

          const now = new Date();
          let sumTotal = 0;
          let sumMonth = 0;
          let sumToday = 0; 

          data.transactions.forEach(tx => {
            const amt = Number(tx.amount);
            if (amt > 0 && !tx.title.includes('ฝาก') && !tx.title.includes('ถอน')) {
              sumTotal += amt;
              
              const txDate = new Date(tx.created_at);
              if (txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()) {
                sumMonth += amt;
              }
              if (isToday(txDate)) {
                sumToday += amt;
              }
            }
          });
          
          setTotalIncome(sumTotal);
          setIncomeThisMonth(sumMonth);
          setIncomeToday(sumToday); 

          const processedMembers = data.teamMembers.map(member => {
            const memberName = member.username.trim();
            const memberCurrency = member.currency_code;
            let pComm = 0;
            let wComm = 0;
            let p2pComm = 0; 
            let memberIncomeToday = 0; 

            data.transactions.forEach(tx => {
              const amt = Number(tx.amount);
              if (amt > 0 && tx.title.includes(memberName)) {
                if (tx.title.includes('ถูกรางวัล')) {
                  wComm += amt; 
                } else if (tx.title.includes('P2P')) {
                  p2pComm += amt; 
                } else {
                  pComm += amt; 
                }
                
                if (isToday(tx.created_at)) {
                    memberIncomeToday += amt;
                }
              }
            });

            let rawTeamTotal = Number(member.total_purchase_comm) + Number(member.total_win_comm);
            
            if (memberCurrency !== data.myCurrency) {
                const forwardPair = `${memberCurrency}_${data.myCurrency}`; 
                const reversePair = `${data.myCurrency}_${memberCurrency}`; 

                if (data.exchangeRates && data.exchangeRates[forwardPair]) {
                    rawTeamTotal = rawTeamTotal * Number(data.exchangeRates[forwardPair]);
                } else if (data.exchangeRates && data.exchangeRates[reversePair]) {
                    rawTeamTotal = rawTeamTotal / Number(data.exchangeRates[reversePair]);
                }
            }

            const tComm = rawTeamTotal * (Number(data.bonusPercent) / 100);

            return {
              id: member.user_id,
              name: memberName,
              avatar: `https://ui-avatars.com/api/?name=${memberName}&background=random`,
              isActive: member.is_active,
              joinDate: new Date(member.created_at).toLocaleDateString('th-TH'),
              purchaseComm: pComm,
              winComm: wComm,
              p2pComm: p2pComm, 
              teamBonusComm: tComm,
              memberTotalIncome: pComm + wComm + tComm + p2pComm, 
              memberIncomeToday: memberIncomeToday 
            };
          });

          setTeamMembers(processedMembers);
        }
      } catch (error) {
        console.error("Error fetching team data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const handleShareLink = async () => {
    if (!myUsername) return;
    const link = `https://kinnon.live/register?ref=${myUsername}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KINNON',
          text: 'ระบบจองห้องพัก และจองร้านอาหาร ที่ให้คุณสร้างรายได้ทุกวัน แค่คุณแชร์ หรือไลฟ์มีคนจองหรือใช้บริการคุณมีรายได้ทุกคำสั่งซื้อ!',
          url: link
        });
      } catch (err) {
        console.log('ยกเลิกการแชร์');
      }
    } else {
      navigator.clipboard.writeText(link);
      alert('คัดลอกลิงก์แนะนำเพื่อนเรียบร้อยแล้ว!');
    }
  };

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>กำลังโหลดข้อมูลทีม...</div>;
  const currencySymbol = userCurrency === 'LAK' ? '₭' : userCurrency === 'USD' ? '$' : '฿';

  const filteredMembers = teamMembers.filter(member => {
      if (activeTab === 'all') {
          return true; 
      } else if (activeTab === 'active_today') {
          return member.memberIncomeToday > 0; 
      } else {
          return member.memberIncomeToday === 0; 
      }
  });

  return (
    <div className="app-container">
      <TopNavbar />
      {/* 🌟 1. เปลี่ยนพื้นหลังให้โปร่งแสง เพื่อโชว์ภาพอวกาศ */}
      <div className="main-content" style={{ paddingBottom: '130px', background: 'transparent', minHeight: '100vh' }}>
        
        {/* 🌟 2. กล่องแดงด้านบน ทำให้เป็นกระจกแดงโปร่งแสงนิดๆ */}
        <div style={{ backgroundColor: 'rgba(209, 16, 16, 0.85)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '20px', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', color: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} /> ทีมงานของฉัน ({myUsername || '...'})
          </h2>
          
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', opacity: 0.9 }}>รายได้เดือนนี้</p>
                <h3 style={{ margin: 0, fontSize: '26px', color: '#fef08a' }}>{currencySymbol} {incomeThisMonth.toLocaleString('th-TH', {minimumFractionDigits: 2})}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', opacity: 0.9 }}>สมาชิกทีม</p>
                <h3 style={{ margin: 0, fontSize: '20px' }}>{teamMembers.length} คน</h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px' }}>
              <Clock size={16} color="#cffafe" />
              <div>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>รายได้วันนี้</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#cffafe' }}>{currencySymbol} {incomeToday.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Wallet size={16} color="#fcd34d" />
              <div>
                <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>รายได้สะสมทั้งหมด (ตั้งแต่เริ่ม)</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#fcd34d' }}>{currencySymbol} {totalIncome.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
              </div>
            </div>

          </div>

          <button onClick={handleShareLink} style={{ width: '100%', marginTop: '15px', padding: '12px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: '8px', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
            <UserPlus size={18} /> คัดลอกลิงก์แนะนำเพื่อน
          </button>
        </div>

        <div style={{ padding: '20px 15px' }}>
          
          <div style={{ display: 'flex', borderBottom: '2px solid rgba(255,255,255,0.1)', marginBottom: '15px' }}>
            <div 
              onClick={() => setActiveTab('all')}
              style={{ 
                flex: 1, textAlign: 'center', padding: '10px 5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
                borderBottom: activeTab === 'all' ? '3px solid #00e5ff' : '3px solid transparent', 
                color: activeTab === 'all' ? '#00e5ff' : '#94a3b8', transition: '0.2s'
              }}
            >
              สมาชิกทั้งหมด
            </div>
            <div 
              onClick={() => setActiveTab('active_today')}
              style={{ 
                flex: 1, textAlign: 'center', padding: '10px 5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
                borderBottom: activeTab === 'active_today' ? '3px solid #4ade80' : '3px solid transparent', 
                color: activeTab === 'active_today' ? '#4ade80' : '#94a3b8', transition: '0.2s'
              }}
            >
              มีรายได้วันนี้
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#cbd5e1', backgroundColor: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
               <p style={{ margin: 0, fontSize: '14px' }}>ไม่มีรายชื่อสมาชิกในหมวดหมู่นี้</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredMembers.map(member => (
                // 🌟 3. เปลี่ยนการ์ดสมาชิกเป็น กระจกขาวโปร่งแสง
                <div key={member.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderRadius: '16px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  <img src={member.avatar} alt={member.name} style={{ width: '55px', height: '55px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#ffffff' }}>{member.name}</h4>
                        <p style={{ margin: 0, fontSize: '12px', color: '#4ade80', fontWeight: 'bold' }}>รวม: {currencySymbol} {member.memberTotalIncome.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}><Calendar size={12} /> {member.joinDate}</span>
                    </div>

                    {/* 🌟 4. เปลี่ยน 4 ช่อง ค่าคอม เป็นกระจกสีนีออนโปร่งแสง */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '10px' }}>
                      <div style={{ backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '6px 4px', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '9px', color: '#86efac' }}>ซื้อ {commRates.purchase}%</p>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#4ade80' }}>{currencySymbol}{member.purchaseComm.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                      </div>
                      <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)', padding: '6px 4px', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '9px', color: '#fde047' }}>รางวัล {commRates.win}%</p>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#facc15' }}>{currencySymbol}{member.winComm.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                      </div>
                      <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', padding: '6px 4px', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '9px', color: '#93c5fd' }}>โบนัส {commRates.bonus}%</p>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#60a5fa' }}>{currencySymbol}{member.teamBonusComm.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                      </div>
                      <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', padding: '6px 4px', borderRadius: '8px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '9px', color: '#d8b4fe' }}>แนะนำ P2P</p>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold', color: '#c084fc' }}>{currencySymbol}{member.p2pComm.toLocaleString('th-TH', {minimumFractionDigits: 2})}</p>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Team;