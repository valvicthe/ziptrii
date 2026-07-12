export default function ComingSoon() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#121212', 
      color: '#FFFFFF',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Coming Soon</h1>
      <p style={{ color: '#B0B0B0', fontSize: '1.2rem' }}>We are currently building this feature.</p>
    </div>
  );
}
