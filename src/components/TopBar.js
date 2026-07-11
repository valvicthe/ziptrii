'use client';
import { useEffect, useState } from 'react';

export default function TopBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/'; 
  };

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', gap: '15px' }}>
      <a href="/">Home</a>
      {user ? (
        <>
          <span>Welcome, <strong>{user.username}</strong></span>
          <a href={`/profile/${user.id}`}>My Profile</a>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}
