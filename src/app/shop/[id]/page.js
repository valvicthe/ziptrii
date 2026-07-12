import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export default async function ItemPage({ params }) {
  const { id } = await params;
  const item = (await query('SELECT * FROM items WHERE id = $1', [id])).rows[0];

  if (!item) notFound();

  // Mock Resellers (In a real app, join this with your inventory table)
  const resellers = [
    { username: 'please', price: '1.3K+' },
    { username: 'feud', price: '1.3K+' },
    { username: 'deorn', price: '1.4K+' },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>{item.name}</h1>
        <div style={{ fontSize: '20px', cursor: 'pointer' }}>...</div>
      </div>
      <p style={{ color: '#666', marginBottom: '20px' }}>By <span style={{ color: '#00A2FF' }}>ROBLOX</span></p>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '40px', background: '#fff', padding: '20px', border: '1px solid #ddd' }}>
        
        {/* Left: Image & Favorite */}
        <div style={{ width: '300px' }}>
          <div style={{ width: '300px', height: '300px', background: '#f2f2f2', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#ccc' }}>[Item Image]</span>
          </div>
          {item.type === 'limited' && (
            <div style={{ background: '#28A745', color: '#fff', padding: '5px', textAlign: 'center', fontWeight: 'bold', marginTop: '10px' }}>LIMITED</div>
          )}
          <div style={{ marginTop: '10px', fontSize: '18px' }}>⭐ 11</div>
        </div>

        {/* Right: Details */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#f9f9f9', padding: '15px', border: '1px solid #eee' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.price === 0 ? '#28A745' : '#333' }}>
              {item.price === 0 ? 'Free' : `${item.price} R$`}
            </div>
            <button style={{ width: '100%', padding: '15px', background: '#28A745', color: '#fff', border: 'none', fontSize: '18px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>
              {item.type === 'limited' ? 'Buy' : 'Get'}
            </button>
          </div>

          <div style={{ marginTop: '20px', color: '#555' }}>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Created:</strong> 7/11/2026</p>
            <p><strong>Genres:</strong> All</p>
            <p style={{ marginTop: '20px', lineHeight: '1.6' }}>{item.description}</p>
          </div>
        </div>
      </div>

      {/* Limited Only: Price Chart & Resellers */}
      {item.type === 'limited' && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '20px' }}>
          <h3>Price Chart</h3>
          <div style={{ height: '150px', background: '#f2f2f2', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            [Price Chart Visualization]
          </div>
          
          <h3 style={{ marginTop: '30px' }}>Resellers</h3>
          {resellers.map((reseller, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
              <span>{reseller.username}</span>
              <span>
                <span style={{ marginRight: '10px', fontWeight: 'bold' }}>{reseller.price}</span>
                <button style={{ padding: '5px 15px' }}>Buy</button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
