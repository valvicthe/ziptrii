'use client';
import { useEffect, useState } from 'react';

export default function RobloxRetroPage() {
  const [user, setUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // 1. Check for authentication
    const savedUser = localStorage.getItem('user');
    
    if (!savedUser) {
      window.location.href = '/login';
      return;
    }

    const userData = JSON.parse(savedUser);

    // 2. Check for ban status
    if (userData.isBanned) {
      window.location.href = '/banned';
      return;
    }

    setUser(userData);
  }, []);

  // Only render dashboard if we have a user
  if (!user) return null; 

  return (
    <div style={{ fontFamily: '"HCo Gotham SSm", Arial, sans-serif', color: '#191919', padding: '24px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Sub-Header Toolbar Control Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #DEE1E3' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px' }}>
          Hello, {user.username}!
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #0074BD', borderRadius: '3px', padding: '4px 10px', backgroundColor: '#E5F3FF', fontWeight: '700', fontSize: '12px', color: '#0074BD', userSelect: 'none' }}>
            <span style={{ marginRight: '6px' }}>🛡️ PREMIUM</span>
            <span style={{ backgroundColor: '#0074BD', color: '#FFF', padding: '1px 5px', borderRadius: '2px', fontSize: '10px' }}>FREE</span>
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#5A5A5A', padding: '4px' }}
            >
              ⚙️
            </button>
            {showSettings && (
              <div style={{ position: 'absolute', right: 0, top: '35px', backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '3px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: '130px', zIndex: 9999 }}>
                <div style={{ padding: '10px 14px', fontSize: '13px', borderBottom: '1px solid #EAEAEA', cursor: 'pointer' }} onClick={() => alert('Account Settings Menu')}>Settings</div>
                <div style={{ padding: '10px 14px', fontSize: '13px', color: '#D9534F', cursor: 'pointer' }} onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Experiences Module */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 14px 0' }}>My Experiences</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          <div style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', marginBottom: '6px', border: '1px solid #BDC3C7', background: 'linear-gradient(135deg, #CFD8DC, #90A4AE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#555' }}>
              ZIPTRII PLACE
            </div>
            <div style={{ fontWeight: '500', fontSize: '14px', lineHeight: '1.2' }}>Placeholder</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#747678', marginTop: '4px', fontWeight: '500' }}>
              <span style={{ color: '#02B757' }}>👍 98%</span>
              <span>👤 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
