import './globals.css';
import UserNav from '@/components/UserNav';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';

export const metadata = {
  title: {
    default: 'Ziptrii',
    template: '%s | Ziptrii',
  },
  description: 'Roblox, Reimagined',
  // This explicitly links your favicon
  icons: {
    icon: 'https://raw.githubusercontent.com/valvicthe/ziptrii/refs/heads/main/src/app/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="top-nav">
          <div className="nav-left">
            <div className="logo">ZIPTRII</div>
            <nav className="nav-links">
              <a href="/" className="active">Home</a>
              <a href="/shop">Avatar Shop</a>
              <a href="/create">Create</a>
              <a href="/robux">Robux</a>
            </nav>
            <SearchBar /> 
          </div>
          <UserNav />
        </header>

        <div className="main-layout" style={{ display: 'flex' }}>
          <Sidebar />
          
          <main className="content" style={{ flex: 1 }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
