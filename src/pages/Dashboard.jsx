import React from 'react';

function Dashboard() {
  return (
    <div className="text-white p-4">
      <h2 className="text-2xl font-bold">แดชบอร์ด (Dashboard)</h2>
      <p>เนื้อหาหน้า Dashboard กำลังจะมา...</p>
    </div>
  );
}

// ต้องมีบรรทัดนี้เพื่อแก้ปัญหา Error 'does not provide an export named default'
export default Dashboard;