'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password, type: 'login' }),
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = data.user.isBanned ? '/banned' : '/';
    } else {
      alert(data.error);
    }
  };

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#111214', /* Ziptrii main background */
      fontFamily: '"HCo Gotham SSm", Arial, sans-serif' 
    }}>
      <div style={{ 
        backgroundColor: '#1E1F22', /* Dark card background */
        padding: '40px', 
        borderRadius: '8px', 
        width: '100%', 
        maxWidth: '400px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', 
        border: '1px solid #313338' 
      }}>
        <h1 style={{ color: '#F2F3F5', textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '700' }}>
          Log In to Ziptrii
        </h1>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ 
              padding: '14px', 
              borderRadius: '4px', 
              border: '1px solid #313338', 
              backgroundColor: '#111214', 
              color: '#F2F3F5',
              fontSize: '15px'
            }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ 
              padding: '14px', 
              borderRadius: '4px', 
              border: '1px solid #313338', 
              backgroundColor: '#111214', 
              color: '#F2F3F5',
              fontSize: '15px'
            }} 
          />
          <button 
            type="submit" 
            style={{ 
              padding: '14px', 
              backgroundColor: '#00A2FF', 
              color: '#FFFFFF', 
              border: 'none', 
              borderRadius: '4px', 
              fontWeight: '700', 
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #313338' }} />
          <span style={{ padding: '0 12px', color: '#B5BAC1', fontSize: '12px', fontWeight: '600' }}>OR</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #313338' }} />
        </div>

        {/* Dummy Discord Button */}
        <button 
          onClick={() => alert("Discord login coming soon!")}
          style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: '#5865F2', /* Official Discord Blurple */
            color: '#FFFFFF', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: '700',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {/* Simple Discord Icon SVG */}
          <svg width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.2,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
          Log In with Discord
        </button>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#B5BAC1', fontSize: '14px' }}>
          New to Ziptrii? <a href="/signup" style={{ color: '#00A2FF', textDecoration: 'none', fontWeight: '600' }}>Sign Up!</a>
        </p>
      </div>
    </main>
  );
}
