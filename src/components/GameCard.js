export default function GameCard({ game }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '3px solid #000000',
      boxShadow: '6px 6px 0px #000000',
      padding: '16px',
      borderRadius: '0px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Heavy Image Border */}
      <div style={{ borderBottom: '3px solid #000000', marginBottom: '8px', paddingBottom: '8px' }}>
        <img 
          src={game.imageUrl || "/placeholder.jpg"} 
          alt={game.title}
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0px' }}
        />
      </div>
      
      {/* Brutalist Typography */}
      <h3 style={{ fontFamily: 'sans-serif', fontWeight: '900', fontSize: '1.4rem', textTransform: 'uppercase', margin: 0 }}>
        {game.title}
      </h3>
      
      <p style={{ fontFamily: 'sans-serif', color: '#333333', fontSize: '0.95rem', margin: 0 }}>
        {game.description}
      </p>
      
      <button style={{
        marginTop: 'auto',
        backgroundColor: '#000000',
        color: '#ffffff',
        border: 'none',
        padding: '10px 14px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        cursor: 'pointer',
        borderRadius: '0px'
      }}>
        PLAY NOW
      </button>
    </div>
  );
}
