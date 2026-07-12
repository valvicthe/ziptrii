import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function ItemPage({ params }) {
  const { id } = await params;
  const result = await query('SELECT * FROM items WHERE id = $1', [id]);
  const item = result.rows[0];

  if (!item) notFound();

  async function purchaseItem() {
    'use server';
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    
    if (!userId) throw new Error("You must be logged in.");

    try {
      await query('BEGIN');
      const userRes = await query('SELECT robux FROM users WHERE id = $1 FOR UPDATE', [userId]);
      if (userRes.rows[0].robux < item.price) throw new Error("Insufficient funds");

      await query('UPDATE users SET robux = robux - $1 WHERE id = $2', [item.price, userId]);
      await query('INSERT INTO inventory (user_id, item_id) VALUES ($1, $2)', [userId, item.id]);
      await query('COMMIT');
      
      revalidatePath(`/shop/${id}`);
    } catch (e) {
      await query('ROLLBACK');
      throw e;
    }
  }

  return (
    <div style={{ padding: '40px', color: '#fff', maxWidth: '600px', margin: '0 auto' }}>
      <h1>{item.name}</h1>
      <p style={{ fontSize: '1.2rem', color: '#BDC3C7', margin: '20px 0' }}>{item.description}</p>
      <div style={{ background: '#222', padding: '20px', borderRadius: '8px' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Price: {item.price} R$</p>
        <form action={purchaseItem}>
          <button type="submit" style={{ 
            padding: '12px 24px', 
            background: '#00A2FF', 
            border: 'none', 
            color: 'white', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}>
            Purchase Item
          </button>
        </form>
      </div>
    </div>
  );
}
