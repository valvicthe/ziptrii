'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password, type: 'signup' }),
    });
    const data = await res.json();

    if (data.success) {
      alert("Account created!");
      window.location.href = '/login';
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
      backgroundColor: '#111214', 
      fontFamily: '"HCo Gotham SSm", Arial, sans-serif' 
    }}>
      <div style={{ 
        backgroundColor: '#1E1F22', 
        padding: '40px', 
        borderRadius: '8px', 
        width: '100%', 
        maxWidth: '400px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)', 
        border: '1px solid #313338' 
      }}>
        <h1 style={{ color: '#F2F3F5', textAlign: 'center', marginBottom: '30px', fontSize: '28px', fontWeight: '700' }}>
          Create Account
        </h1>
        
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#B5BAC1', fontSize: '14px' }}>
          Already have an account? <a href="/login" style={{ color: '#00A2FF', textDecoration: 'none', fontWeight: '600' }}>Login here</a>
        </p>
      </div>
    </main>
  );
}
