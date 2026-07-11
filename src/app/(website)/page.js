import GameCard from '@/components/GameCard';

export default function DashboardHome() {
  return (
    <section>
      <div className="user-header">
        <h1 style={{ fontSize: '28px', margin: '0 0 20px 0' }}>Hello, User!</h1>
      </div>

      <div style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #393B3D', paddingBottom: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Popular</h2>
          <a href="#" style={{ color: '#00A2FF', textDecoration: 'none', fontSize: '14px' }}>See All</a>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <GameCard title="Classic Crossroads" rating="98%" playing="412" />
        </div>
      </div>
    </section>
  );
}
