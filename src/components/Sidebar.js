'use client';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <aside style={{ width: '240px', backgroundColor: '#1A1A1A', borderRight: '1px solid #333', minHeight: '100vh', padding: '20px 0' }}>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <a href="/" className="sidebar-item">Home</a>
        <a href={user ? `/users/${user.id}` : "/login"} className="sidebar-item">Profile</a>
        <a href="/messages" className="sidebar-item">Messages</a>
        <a href="/friends" className="sidebar-item">Friends</a>
        <a href="/avatar" className="sidebar-item">Avatar</a>
        <a href="/trade" className="sidebar-item">Trade</a>
        <a href="/inventory" className="sidebar-item">Inventory</a>
        <a href="/settings" className="sidebar-item">Settings</a>
        <a href="/groups" className="sidebar-item">Groups</a>
        a href="/robux" className="sidebar-item">Premium</a>
        <a href="https://discord.gg/MkzpNEdWU" className="sidebar-item">Discord Server</a>
        {user?.role === 'admin' && (
          <a href="/admin" style={{ ...linkStyle, borderLeft: '4px solid #d9534f', color: '#d9534f' }}>Admin</a>
        )}
      </nav>
    </aside>
  );
}

const linkStyle = { padding: '12px 20px', color: '#E0E0E0', textDecoration: 'none', fontSize: '15px' };
