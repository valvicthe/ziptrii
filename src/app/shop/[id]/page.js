import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function ItemPage({ params }) {
  const { id } = await params;
  const item = (await query('SELECT * FROM items WHERE id = $1', [id])).rows[0];

  if (!item) notFound();

  // Mock Resellers
  const resellers = [
    { username: 'please', price: '1.3K+' },
    { username: 'feud', price: '1.3K+' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#121212', color: '#E0E0E0', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#FFFFFF' }}>{item.name}</h1>
      </div>
      <p style={{ color: '#B0B0B0', marginBottom: '20px' }}>By <span style={{ color: '#00A2FF' }}>ROBLOX</span></p>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '40px', background: '#1E1E1E', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
        
        {/* Left: Image */}
        <div style={{ width: '300px' }}>
          <div style={{ width: '300px', height: '300px', background: '#2C2C2C', border: '1px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#555' }}>[Item Image]</span>
          </div>
          {item.type === 'limited' && (
            <div style={{ background: '#28A745', color: '#FFF', padding: '5px', textAlign: 'center', fontWeight: 'bold', marginTop: '10px', borderRadius: '4px' }}>LIMITED</div>
          )}
        </div>

        {/* Right: Details */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#252525', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: item.price === 0 ? '#4CAF50' : '#FFFFFF' }}>
              {item.price === 0 ? 'Free' : `${item.price} R$`}
            </div>
            <button style={{ width: '100%', padding: '15px', background: '#28A745', color: '#FFF', border: 'none', fontSize: '18px', fontWeight: 'bold', marginTop: '15px', cursor: 'pointer', borderRadius: '4px' }}>
              {item.type === 'limited' ? 'Buy' : 'Get'}
            </button>
          </div>

          <div style={{ marginTop: '20px', color: '#B0B0B0' }}>
            <p><strong>Type:</strong> <span style={{color: '#E0E0E0'}}>{item.type}</span></p>
            <p><strong>Created:</strong> <span style={{color: '#E0E0E0'}}>7/11/2026</span></p>
            <p style={{ marginTop: '20px', lineHeight: '1.6', color: '#E0E0E0' }}>{item.description}</p>
          </div>
        </div>
      </div>

      {/* Limited Only Section */}
      {item.type === 'limited' && (
        <div style={{ marginTop: '20px', border: '1px solid #333', padding: '20px', background: '#1E1E1E', borderRadius: '8px' }}>
          <h3 style={{ color: '#FFFFFF' }}>Price Chart</h3>
          <div style={{ height: '150px', background: '#252525', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #444' }}>
            <span style={{ color: '#555' }}>[Price Chart Visualization]</span>
          </div>
          
          <h3 style={{ marginTop: '30px', color: '#FFFFFF' }}>Resellers</h3>
          {resellers.map((reseller, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #333' }}>
              <span style={{ color: '#E0E0E0' }}>{reseller.username}</span>
              <span>
                <span style={{ marginRight: '15px', fontWeight: 'bold', color: '#4CAF50' }}>{reseller.price}</span>
                <button style={{ padding: '6px 16px', background: '#333', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Buy</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
