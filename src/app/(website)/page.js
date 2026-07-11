'use client';
import { useState } from 'react';

export default function RobloxRetroPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      setIsAuthenticated(true);
    }
  };

  // 1. UNAUTHENTICATED: 2020 Login Screen Layout
  if (!isAuthenticated) {
    return (
      <main style={{ backgroundColor: '#F2F4F5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: '"HCo Gotham SSm", Arial, sans-serif', padding: '20px' }}>
        {/* Top Logo Marker */}
        <div style={{ margin: '40px 0 20px 0', fontSize: '40px', fontWeight: '700', color: '#191919', letterSpacing: '-1px' }}>
          ZIPTRII
        </div>

        {/* Login White Box Container */}
        <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '400px', padding: '30px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #BDC3C7' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', textAlign: 'center', margin: '0 0 20px 0', color: '#191919' }}>
            Login to Ziptrii
          </h2>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Username/Email/Phone" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '10px 12px', fontSize: '16px', border: '1px solid #A7A7A7', borderRadius: '3px', backgroundColor: '#FFF', color: '#191919' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px 12px', fontSize: '16px', border: '1px solid #A7A7A7', borderRadius: '3px', backgroundColor: '#FFF', color: '#191919' }}
            />
            
            <button type="submit" style={{ backgroundColor: '#0074BD', color: '#FFFFFF', border: 'none', padding: '12px', fontSize: '16px', fontWeight: '600', borderRadius: '3px', cursor: 'pointer', marginTop: '10px' }}>
              Log In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#555555' }}>
            Don't have an account? <span style={{ color: '#0074BD', cursor: 'pointer' }}>Sign Up</span>
          </div>
        </div>
      </main>
    );
  }

  // 2. AUTHENTICATED: Main Home Interface Layout
  return (
    <main style={{ backgroundColor: '#F2F4F5', minHeight: '100vh', fontFamily: '"HCo Gotham SSm", Arial, sans-serif', color: '#191919', margin: 0, padding: 0 }}>
      
      {/* 2020 Structural Global Navigation Bar */}
      <nav style={{ backgroundColor: '#FFFFFF', height: '40px', borderBottom: '1px solid #BDC3C7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontWeight: '700', fontSize: '20px', letterSpacing: '-0.5px', cursor: 'pointer' }}>ZIPTRII</span>
          <span style={{ fontSize: '15px', fontWeight: '500', color: '#555555', cursor: 'pointer' }}>Discover</span>
          <span style={{ fontSize: '15px', fontWeight: '500', color: '#555555', cursor: 'pointer' }}>Avatar Shop</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* FREE Premium Status Block */}
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#E5F3FF', border: '1px solid #0074BD', borderRadius: '3px', padding: '2px 8px', fontSize: '11px', fontWeight: '700', color: '#0074BD' }}>
            <span style={{ marginRight: '4px' }}>🛡️ PREMIUM</span>
            <span style={{ backgroundColor: '#0074BD', color: '#FFF', padding: '0 4px', borderRadius: '2px', fontSize: '9px' }}>FREE</span>
          </div>

          {/* Interactive Settings Gear Icon Wrapper */}
          <div 
            onClick={() => setShowSettings(!showSettings)}
            style={{ fontSize: '18px', cursor: 'pointer', padding: '5px', position: 'relative', userSelect: 'none' }}
          >
            ⚙️
            {showSettings && (
              <div style={{ position: 'absolute', right: 0, top: '35px', backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '3px', boxShadow: '0 2px 5px rgba(0,0,0,0.15)', width: '120px', display: 'flex', flexDirection: 'column', zIndex: 110 }}>
                <div style={{ padding: '8px 12px', fontSize: '13px', borderBottom: '1px solid #EAEAEA', cursor: 'pointer' }}>Settings</div>
                <div onClick={() => setIsAuthenticated(false)} style={{ padding: '8px 12px', fontSize: '13px', color: '#D9534F', cursor: 'pointer' }}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Dashboard Feed */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <header style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', margin: 0 }}>Home</h1>
        </header>

        {/* Structural Content Segment Grid */}
        <section style={{ backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '4px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 15px 0', borderBottom: '1px solid #EAEAEA', paddingBottom: '10px' }}>
            My Experiences
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
            {/* Structural Game Tile Item */}
            <div style={{ cursor: 'pointer' }}>
              <div style={{ width: '100%', height: '150px', backgroundColor: '#D6DBDF', borderRadius: '4px', marginBottom: '8px', border: '1px solid #BDC3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#7F8C8D' }}>
                [PLACEHOLDER]
              </div>
              <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ziptrii Classic 2020
              </div>
              <div style={{ fontSize: '12px', color: '#7F8C8D', marginTop: '2px' }}>
                👍 98% | 👤 14.2K
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
