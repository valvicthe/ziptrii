export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Avatar Shop', // This will result in "Avatar Shop | Ziptrii"
};

export default async function ShopPage() {
  const items = (await query('SELECT * FROM items')).rows;

  async function purchaseItem(formData) {
    'use server';
    
    // 1. Get userId securely from cookies, NOT the form
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) throw new Error("You must be logged in to purchase items.");

    const itemId = formData.get('itemId');
    const price = parseInt(formData.get('price'));

    try {
      await query('BEGIN');
      
      // 2. Check user balance and lock the row
      const userRes = await query('SELECT robux FROM users WHERE id = $1 FOR UPDATE', [userId]);
      const user = userRes.rows[0];
      
      if (!user) throw new Error("User not found");
      if (user.robux < price) throw new Error("Insufficient funds");

      // 3. Subtract Robux and Insert into Inventory
      await query('UPDATE users SET robux = robux - $1 WHERE id = $2', [price, userId]);
      await query('INSERT INTO inventory (user_id, item_id) VALUES ($1, $2)', [userId, itemId]);
      
      await query('COMMIT');
      revalidatePath('/shop');
      
    } catch (error) {
      await query('ROLLBACK');
      console.error("PURCHASE ERROR:", error.message);
      // Re-throw or handle error
      throw new Error(error.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Avatar Shop</h1>
      <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
        {items.map(item => (
          <div key={item.id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '8px' }}>
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
    </div>
  );
}
