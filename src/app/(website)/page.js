'use client';
import { useState } from 'react';

export default function RobloxRetroPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setLoginError('Server connection error.');
    }
  };

  // 1. UNAUTHENTICATED: 2020 Login Screen Layout
  if (!isAuthenticated) {
    return (
      <main style={{ backgroundColor: '#F2F4F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"HCo Gotham SSm", Arial, sans-serif', padding: '40px 20px' }}>
        <div style={{ fontSize: '40px', fontWeight: '700', color: '#191919', marginBottom: '20px', letterSpacing: '-1px' }}>
          ZIPTRII
        </div>
        <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #BDC3C7' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', textAlign: 'center', margin: '0 0 20px 0', color: '#191919' }}>Login to Ziptrii</h2>
          
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ padding: '10px 12px', fontSize: '16px', border: '1px solid #A7A7A7', borderRadius: '3px', color: '#000' }} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ padding: '10px 12px', fontSize: '16px', border: '1px solid #A7A7A7', borderRadius: '3px', color: '#000' }} 
              required 
            />
            
            {loginError && <div style={{ color: '#D9534F', fontSize: '13px', fontWeight: '500' }}>{loginError}</div>}
            
            <button type="submit" style={{ backgroundColor: '#0074BD', color: '#FFFFFF', border: 'none', padding: '12px', fontSize: '16px', fontWeight: '600', borderRadius: '3px', cursor: 'pointer' }}>
              Log In
            </button>
          </form>
        </div>
      </main>
    );
  }

  // 2. AUTHENTICATED: Main Home Content Layout
  return (
    <div style={{ fontFamily: '"HCo Gotham SSm", Arial, sans-serif', color: '#191919', padding: '24px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Sub-Header Toolbar Control Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #DEE1E3' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '600', margin: 0, letterSpacing: '-0.5px' }}>
          Hello, {user?.username}!
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* FREE Premium Tag Widget */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #0074BD', borderRadius: '3px', padding: '4px 10px', backgroundColor: '#E5F3FF', fontWeight: '700', fontSize: '12px', color: '#0074BD', userSelect: 'none' }}>
            <span style={{ marginRight: '6px' }}>🛡️ PREMIUM</span>
            <span style={{ backgroundColor: '#0074BD', color: '#FFF', padding: '1px 5px', borderRadius: '2px', fontSize: '10px' }}>FREE</span>
          </div>

          {/* Interactive Settings Gear Block */}
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
                <div style={{ padding: '10px 14px', fontSize: '13px', color: '#D9534F', cursor: 'pointer' }} onClick={() => { setIsAuthenticated(false); setUser(null); }}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Experiences Module */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 14px 0' }}>My Experiences</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
          
          {/* The 2020 Game Tile Component */}
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
