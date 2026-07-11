import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function ShopPage() {
  const items = (await query('SELECT * FROM items')).rows;

  async function purchaseItem(formData) {
    'use server';
    const userId = formData.get('userId'); // Get from your session logic
    const itemId = formData.get('itemId');
    const price = parseInt(formData.get('price'));

    // ATOMIC TRANSACTION: Only buy if user has enough money
    await query('BEGIN');
    const user = (await query('SELECT robux FROM users WHERE id = $1 FOR UPDATE', [userId])).rows[0];
    
    if (user.robux >= price) {
      await query('UPDATE users SET robux = robux - $1 WHERE id = $2', [price, userId]);
      await query('INSERT INTO inventory (user_id, item_id) VALUES ($1, $2)', [userId, itemId]);
      await query('COMMIT');
    } else {
      await query('ROLLBACK');
    }
    revalidatePath('/shop');
  }

  return (
    <div>
      <h1>Avatar Shop</h1>
      {items.map(item => (
        <div key={item.id} style={{ border: '1px solid #333', padding: '10px' }}>
          <h3>{item.name}</h3>
          <p>{item.price} R$</p>
          <form action={purchaseItem}>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name="price" value={item.price} />
            <button type="submit">Buy Now</button>
          </form>
        </div>
      ))}
    </div>
  );
}
