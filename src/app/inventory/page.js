import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Inventory', 
};

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  
  if (!userId) return <p>Please log in.</p>;

  // Join inventory with items to get the actual item names
  const myItems = (await query(`
    SELECT items.name, items.image_url 
    FROM inventory 
    JOIN items ON inventory.item_id = items.id 
    WHERE inventory.user_id = $1
  `, [userId])).rows;

  return (
    <div style={{ padding: '30px', color: '#fff' }}>
      <h1>My Inventory</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
        {myItems.map((item, i) => (
          <div key={i} style={{ padding: '20px', background: '#222', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
            {/* Added a placeholder for the image if you add them later */}
            <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#333', marginBottom: '10px', borderRadius: '4px' }}></div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
