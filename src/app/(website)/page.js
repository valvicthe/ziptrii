import GameCard from '../components/GameCard';

export default function WebPage() {
  // Assuming games array is fetched or passed
  const mockGames = [
    { id: 1, title: "Home - Ziptrii", description: "ok test" }
  ];

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '40px 20px', color: '#000000' }}>
      {/* 2020 Header Banner */}
      <header style={{ borderBottom: '4px double #000000', paddingBottom: '20px', marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
          ZIPTRII
        </h1>
        <p style={{ margin: 0, fontStyle: 'italic', fontWeight: 'bold' }}>EST. 2020 // PRODUCTION BUILD</p>
      </header>

      {/* Raw Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {mockGames.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
}
