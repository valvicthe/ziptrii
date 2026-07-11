export default function BannedPage() {
  return (
    <main style={{ 
      backgroundColor: '#F2F4F5', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: '"HCo Gotham SSm", Arial, sans-serif', 
      padding: '40px 20px' 
    }}>
      <div style={{ fontSize: '40px', fontWeight: '700', color: '#191919', marginBottom: '20px' }}>
        ZIPTRII
      </div>
      <div style={{ 
        backgroundColor: '#ffffff', 
        width: '100%', 
        maxWidth: '400px', 
        padding: '30px', 
        borderRadius: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        border: '1px solid #BDC3C7',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#D9534F' }}>
          Account Deleted
        </h2>
        <p style={{ color: '#5A5A5A', fontSize: '15px', marginBottom: '20px' }}>
          Your account has been deleted for violating our terms of service. Please contact support in our Discord if you believe this is a mistake.
        </p>
        <button 
          onClick={() => { localStorage.removeItem('user'); window.location.href = '/login'; }} 
          style={{ 
            backgroundColor: '#0074BD', 
            color: '#FFFFFF', 
            border: 'none', 
            padding: '10px 20px', 
            fontSize: '14px', 
            fontWeight: '600', 
            borderRadius: '3px', 
            cursor: 'pointer' 
          }}
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
