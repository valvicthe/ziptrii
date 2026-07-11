'use client';
import { useEffect, useState } from 'react';

export default function UserNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Attempt to load the user from local storage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    // Force a full redirect to home to refresh state
    window.location.href = '/';
  };

  return (
    <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      {user ? (
        <>
          {/* Dynamic Robux Balance */}
          <span className="robux-balance" style={{ color: '#00A2FF', fontWeight: 'bold' }}>
            {user.robux ?? 0} <span className="robux-icon">R$</span>
          </span>
          
          {/* Dynamic Profile Link */}
          <a href={`/users/${user.id}`} className="user-pill" style={{ color: '#E0E0E0', textDecoration: 'none' }}>
            {user.username}
          </a>
          
          <button 
            onClick={handleLogout} 
            style={{ 
              background: '#333', 
              border: 'none', 
              color: '#fff', 
              padding: '5px 10px', 
              borderRadius: '3px', 
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <a href="/login" className="user-pill" style={{ color: '#00A2FF', textDecoration: 'none' }}>
          Login
        </a>
      )}
    </div>
  );
}
