import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const items = (await query('SELECT * FROM items')).rows;

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', color: '#E0E0E0', backgroundColor: '#121212', minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '200px', flexShrink: 0, paddingRight: '20px', borderRight: '1px solid #333' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#FFF' }}>Catalog</h2>
        <h3 style={{ fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '10px', color: '#FFF' }}>Category</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {['Featured', 'Collectibles', 'Clothing', 'Accessories'].map(cat => (
            <li key={cat} style={{ padding: '8px 0', cursor: 'pointer', color: '#B0B0B0', ':hover': { color: '#FFF' } }}>
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input 
            placeholder="Search" 
            style={{ width: '60%', padding: '10px', background: '#252525', border: '1px solid #333', color: '#FFF', borderRadius: '4px' }} 
          />
          <select style={{ padding: '10px', background: '#252525', border: '1px solid #333', color: '#FFF' }}>
            <option>Relevance</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
          {items.map(item => (
            <Link href={`/shop/${item.id}`} key={item.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ 
                border: '1px solid #333', 
                background: '#1E1E1E', 
                borderRadius: '4px', 
                position: 'relative', 
                overflow: 'hidden',
                transition: 'border 0.2s'
              }}>
                {/* Status Tags */}
                {item.is_new && <span style={{ position: 'absolute', top: 5, right: 5, background: '#f0ad4e', color: '#000', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', borderRadius: '3px' }}>NEW</span>}
                {item.is_on_sale && <span style={{ position: 'absolute', top: 5, left: 5, background: '#d9534f', color: '#fff', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', borderRadius: '3px' }}>SALE</span>}
                
                <div style={{ height: '160px', background: '#2C2C2C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#555' }}>Image</div>
                </div>
                
                <div style={{ padding: '10px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '5px', color: '#FFF' }}>{item.name}</div>
                  <div style={{ color: '#00A2FF', fontWeight: 'bold' }}>{item.price} R$</div>
                  {item.type !== 'normal' && (
                    <div style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}>
                       {item.type.toUpperCase()}: {item.remaining}/{item.stock}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
