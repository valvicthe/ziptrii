'use client';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user in local storage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session");
      }
    }
  }, []);

  return (
    <aside style={{ 
      width: '240px', 
      backgroundColor: '#1A1A1A', 
      borderRight: '1px solid #333', 
      padding: '20px 0',
      minHeight: 'calc(100vh - 60px)'
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column' }}>
        <a href="/" style={sidebarLinkStyle}>Home</a>
        
        {/* Dynamic Profile Link */}
        <a href={user ? `/users/${user.id}` : "/login"} style={sidebarLinkStyle}>
          Profile
        </a>
        
        <a href="/messages" style={sidebarLinkStyle}>Messages</a>
        <a href="/friends" style={sidebarLinkStyle}>Friends</a>
        <a href="/inventory" style={sidebarLinkStyle}>Inventory</a>

        {/* Admin Link: Only renders if user.role is 'admin' */}
        {user?.role === 'admin' && (
          <a href="/admin" style={{ ...sidebarLinkStyle, borderLeft: '4px solid #d9534f', color: '#d9534f' }}>
            Admin Panel
          </a>
        )}
      </nav>
    </aside>
  );
}

const sidebarLinkStyle = {
  padding: '12px 20px',
  color: '#E0E0E0',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'background 0.2s',
  display: 'block'
};
