import './globals.css';

export const metadata = {
  title: 'Ziptrii',
  description: 'Step back into the modern classic era of 2020.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="top-nav">
          <div className="nav-left">
            <div className="logo">ZIPTRII</div>
            <nav className="nav-links">
              <a href="/" className="active">Discover</a>
              <a href="/shop">Avatar Shop</a>
              <a href="/create">Create</a>
              <a href="/robux">Robux</a>
            </nav>
          </div>
          <div className="nav-right">
            <span className="robux-balance">13,370 <span className="robux-icon">R$</span></span>
            <a href="/users/1" className="user-pill" style={{ color: '#fff', textDecoration: 'none' }}>ZiptriiAdmin</a>
          </div>
        </header>

        <div className="main-layout">
          <aside className="left-sidebar">
            <a href="/" className="sidebar-item active">Home</a>
            <a href="/users/1" className="sidebar-item">Profile</a>
            <a href="/messages" className="sidebar-item">Messages</a>
            <a href="/friends" className="sidebar-item">Friends</a>
            <a href="/inventory" className="sidebar-item">Inventory</a>
            <a href="/admin" className="sidebar-item" style={{ borderLeft: '2px solid #d9534f', paddingLeft: '10px' }}>Admin</a>
          </aside>
          
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
