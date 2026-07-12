import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AvatarEditor() {
  const userId = 1; // Replace with your auth logic
  
  // Fetch equipped items and all available assets
  const equipped = (await query('SELECT * FROM user_equipped WHERE user_id = $1', [userId])).rows[0];
  const allAssets = (await query('SELECT * FROM assets')).rows;

  return (
    <div style={{ display: 'flex', gap: '50px', padding: '40px', backgroundColor: '#121212', color: '#FFF' }}>
      
      {/* PREVIEW WINDOW (The "Avatar") */}
      <div style={{ position: 'relative', width: '200px', height: '300px', background: '#1E1E1E' }}>
        {/* Layer items here. Z-index controls the order */}
        {equipped?.hat_id && <img src={getImg(equipped.hat_id, allAssets)} style={{ position: 'absolute', zIndex: 3, width: '100%' }} />}
        {equipped?.shirt_id && <img src={getImg(equipped.shirt_id, allAssets)} style={{ position: 'absolute', zIndex: 2, width: '100%' }} />}
        {equipped?.pants_id && <img src={getImg(equipped.pants_id, allAssets)} style={{ position: 'absolute', zIndex: 1, width: '100%' }} />}
      </div>

      {/* SELECTION MENU */}
      <div>
        <h2>Catalog</h2>
        {/* Map through allAssets and create buttons to update user_equipped */}
        <form action={equipItemAction}>
           {allAssets.map(item => (
             <button key={item.id} name="assetId" value={item.id} type="submit">
               Equip {item.name}
             </button>
           ))}
        </form>
      </div>
    </div>
  );
}

function getImg(id, assets) {
    return assets.find(a => a.id === id)?.image_url;
}
