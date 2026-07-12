import { query } from '@/lib/db';
import { uploadToBucket } from '@/lib/s3'; // Ensure this utility file exists
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CreatePage() {
  async function handleCreate(formData) {
    'use server';

    const file = formData.get('image');
    const name = formData.get('name');
    const price = parseInt(formData.get('price'));
    const type = formData.get('type');

    // 1. Upload to Railway Bucket
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await uploadToBucket(buffer, file.name, file.type);

    // 2. Save to DB
    await query(
      'INSERT INTO items (name, price, image_url, type, is_new, stock, remaining) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [name, price, imageUrl, type, true, 100, 100] // Defaulting stock/new for testing
    );

    revalidatePath('/shop');
    redirect('/shop');
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: '#E0E0E0', backgroundColor: '#121212', minHeight: '100vh', borderRadius: '8px' }}>
      <h1 style={{ color: '#FFF', marginBottom: '20px' }}>Create New Item</h1>
      
      <form action={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#1E1E1E', padding: '25px', border: '1px solid #333', borderRadius: '8px' }}>
        
        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          Item Name
          <input name="name" required style={{ padding: '10px', background: '#252525', border: '1px solid #444', color: '#FFF', borderRadius: '4px' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          Price (R$)
          <input name="price" type="number" required style={{ padding: '10px', background: '#252525', border: '1px solid #444', color: '#FFF', borderRadius: '4px' }} />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          Item Type
          <select name="type" style={{ padding: '10px', background: '#252525', border: '1px solid #444', color: '#FFF', borderRadius: '4px' }}>
            <option value="normal">Normal</option>
            <option value="limited">Limited</option>
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          Image Upload
          <input name="image" type="file" accept="image/*" required style={{ padding: '10px', background: '#252525', border: '1px solid #444', color: '#FFF', borderRadius: '4px' }} />
        </label>

        <button type="submit" style={{ padding: '12px', background: '#28A745', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
          Publish to Shop
        </button>
      </form>
    </div>
  );
}
