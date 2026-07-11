'use client';
import { useEffect, useState } from 'react';

export const metadata = {
  title: 'Home', // This will result in "Avatar Shop | Ziptrii"
};

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
    <div style={{ fontFamily: '"HCo Gotham SSm", Arial, sans-serif', padding: '24px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Sub-Header Toolbar Control Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #393B3D' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px', color: '#FFFFFF' }}>
          Hello, {user.username}!
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Badge */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #0074BD', borderRadius: '3px', padding: '4px 10px', backgroundColor: '#E5F3FF', fontWeight: '700', fontSize: '12px', color: '#0074BD' }}>
            Ziptrii (Beta)
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#BDC3C7', padding: '4px' }}
            >
              ⚙️
            </button>
            {showSettings && (
              <div style={{ position: 'absolute', right: 0, top: '35px', backgroundColor: '#232527', border: '1px solid #393B3D', borderRadius: '3px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', width: '130px', zIndex: 9999 }}>
                <div style={{ padding: '10px 14px', fontSize: '13px', borderBottom: '1px solid #393B3D', cursor: 'pointer', color: '#FFFFFF' }} onClick={() => alert('Account Settings')}>Settings</div>
                <div style={{ padding: '10px 14px', fontSize: '13px', color: '#D9534F', cursor: 'pointer' }} onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Experiences Module */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 14px 0', color: '#FFFFFF' }}>Recently Played</h2>
        
        {/* Placeholder Box */}
        <div className="game-placeholder">
          <p>You haven't played any games yet!</p>
        </div>
      </div>
    </div>
  );
}
