import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Marketplace' };

export default async function ShopPage() {
  const items = (await query('SELECT id, name, price FROM items')).rows;

  return (
    <div style={{ padding: '40px', color: '#fff', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Featured on Ziptrii</h1>
      {/* Responsive Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        {items.map(item => (
          <Link href={`/shop/${item.id}`} key={item.id} style={{ textDecoration: 'none' }}>
            <div style={{ 
              border: '1px solid #333', 
              padding: '20px', 
              borderRadius: '8px', 
              background: '#222',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{item.name}</h3>
              <p style={{ color: '#00A2FF', fontWeight: 'bold' }}>{item.price} R$</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
