'use client';
import { useEffect, useState } from 'react';

export default function UserNav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="nav-right">
      {user ? (
        <>
          <span className="robux-balance">13,370 <span className="robux-icon">R$</span></span>
          <a href={`/profile/${user.id}`} className="user-pill">{user.username}</a>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </>
      ) : (
        <a href="/login" className="user-pill">Login</a>
      )}
    </div>
  );
}
