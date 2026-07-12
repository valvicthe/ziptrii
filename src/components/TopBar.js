'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  return (
    <nav style={{ 
      padding: '10px 20px', 
      borderBottom: '1px solid #313338', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      backgroundColor: '#1E1F22', 
      color: '#fff',
      fontFamily: '"HCo Gotham SSm", Arial, sans-serif'
    }}>
      {/* Left Side: Home & Search */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <a href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#fff', fontSize: '18px' }}>Ziptrii</a>
        
        <input 
          type="text" 
          placeholder="Search users, items..." 
          onKeyDown={handleSearch}
          style={{ 
            padding: '6px 12px', 
            borderRadius: '4px', 
            border: '1px solid #393B3D', 
            background: '#111214', 
            color: '#fff',
            width: '250px'
          }} 
        />
      </div>

      {/* Right Side: User Links & Settings */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#B5BAC1', fontSize: '14px' }}>
              Welcome, <strong style={{ color: '#fff' }}>{user.username}</strong>
            </span>
            
            <a href={`/users/${user.id}`} style={{ 
              textDecoration: 'none', 
              color: '#B5BAC1', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              {user.username}
            </a>
            
            <a href="/settings" style={{ 
              fontSize: '20px', 
              textDecoration: 'none', 
              color: '#B5BAC1',
              display: 'flex',
              alignItems: 'center'
            }}>
              ⚙️
            </a>
          </>
        ) : (
          <a href="/login" style={{ textDecoration: 'none', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>Login</a>
        )}
      </div>
    </nav>
  );
}
