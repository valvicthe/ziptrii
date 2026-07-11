import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export default async function InventoryPage() {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) return <p>Please log in.</p>;

  // Join inventory with items to get the actual item names
  const myItems = (await query(`
    SELECT items.name, items.image_url 
    FROM inventory 
    JOIN items ON inventory.item_id = items.id 
    WHERE inventory.user_id = $1
  `, [userId])).rows;

  return (
    <div>
      <h1>My Inventory</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        {myItems.map((item, i) => (
          <div key={i} style={{ padding: '20px', background: '#222' }}>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
