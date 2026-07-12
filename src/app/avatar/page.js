import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// --- AUTH LOGIC ---
async function getUserId() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value; // Make sure this matches your login cookie name
  
  if (!userId) {
    throw new Error('User not authenticated');
  }
  return parseInt(userId);
}

// --- SERVER ACTION (Handles Upsert) ---
async function equipItem(formData) {
  'use server';
  const userId = await getUserId();
  const assetId = parseInt(formData.get('assetId'));
  const type = formData.get('type'); // 'hat', 'shirt', or 'pants'

  // UPSERT: If user_equipped doesn't exist, create it. If it does, update the column.
  await query(`
    INSERT INTO user_equipped (user_id, ${type}_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id) 
    DO UPDATE SET ${type}_id = EXCLUDED.${type}_id
  `, [userId, assetId]);
  
  revalidatePath('/avatar');
}

// --- PAGE COMPONENT ---
export default async function AvatarEditor() {
  let userId;
  try {
    userId = await getUserId();
  } catch (e) {
    return <div style={{color: '#FFF', padding: '40px'}}>Please log in to edit your avatar.</div>;
  }
  
  // Fetch data
  const equippedRows = (await query('SELECT * FROM user_equipped WHERE user_id = $1', [userId])).rows;
  const equipped = equippedRows[0] || {};
  const allAssets = (await query('SELECT * FROM assets')).rows;

  return (
    <div style={{ padding: '40px', color: '#FFF', display: 'flex', gap: '50px', background: '#121212', minHeight: '100vh' }}>
      
      {/* PREVIEW */}
      <div style={{ position: 'relative', width: '200px', height: '300px', background: '#1E1E1E', border: '2px solid #333' }}>
        {allAssets.map(asset => {
          const isEquipped = equipped[`${asset.type}_id`] === asset.id;
          if (!isEquipped) return null;
          
          const zIndex = asset.type === 'hat' ? 3 : asset.type === 'shirt' ? 2 : 1;
          return (
            <img key={asset.id} src={asset.image_url} style={{ position: 'absolute', zIndex, width: '100%', top: 0, left: 0 }} alt={asset.name} />
          );
        })}
      </div>

      {/* CATALOG */}
      <div>
        <h1>Avatar Editor</h1>
        {['hat', 'shirt', 'pants'].map(type => (
          <div key={type} style={{ marginBottom: '20px' }}>
            <h3 style={{ textTransform: 'capitalize' }}>{type}s</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              {allAssets.filter(a => a.type === type).map(asset => (
                <form key={asset.id} action={equipItem}>
                  <input type="hidden" name="assetId" value={asset.id} />
                  <input type="hidden" name="type" value={type} />
                  <button type="submit" style={{ padding: '10px', background: equipped[`${type}_id`] === asset.id ? '#28A745' : '#333', color: '#FFF', border: 'none', cursor: 'pointer' }}>
                    {asset.name}
                  </button>
                </form>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
