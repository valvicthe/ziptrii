export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import Link from 'next/link';

export default async function SearchPage({ searchParams }) {
  const q = (await searchParams)?.q || '';
  const searchPattern = `%${q}%`;

  // Fetch Users
  const userResults = await query(
    'SELECT id, username, display_name FROM users WHERE username ILIKE $1 OR display_name ILIKE $1 LIMIT 10',
    [searchPattern]
  );

  // Fetch Items
  const itemResults = await query(
    'SELECT id, name, price FROM items WHERE name ILIKE $1 LIMIT 10',
    [searchPattern]
  );

  return (
    <div style={{ maxWidth: '960px', margin: '20px auto', padding: '0 20px', color: '#F2F3F5', fontFamily: '"HCo Gotham SSm", Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Search Results for "{q}"</h1>

      {/* Users Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #313338', paddingBottom: '10px', marginBottom: '15px' }}>Users</h2>
        {userResults.rows.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {userResults.rows.map(user => (
              <Link key={user.id} href={`/users/${user.id}`} style={{ textDecoration: 'none', color: '#00A2FF', background: '#1E1F22', padding: '12px', borderRadius: '4px', border: '1px solid #313338' }}>
                {user.display_name} (@{user.username})
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: '#B5BAC1' }}>No users found.</p>
        )}
      </section>

      {/* Items Section */}
      <section>
        <h2 style={{ fontSize: '18px', borderBottom: '1px solid #313338', paddingBottom: '10px', marginBottom: '15px' }}>Items</h2>
        {itemResults.rows.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {itemResults.rows.map(item => (
              <div key={item.id} style={{ background: '#1E1F22', padding: '12px', borderRadius: '4px', border: '1px solid #313338', display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <span style={{ color: '#00A2FF' }}>{item.price} R$</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#B5BAC1' }}>No items found.</p>
        )}
      </section>
    </div>
  );
}
