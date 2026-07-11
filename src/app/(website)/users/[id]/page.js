import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

// Server-side renders the target user's custom layout
async function getUserData(userId) {
  const res = await query(
    'SELECT id, username, display_name, description, role, is_banned, created_at FROM users WHERE id = $1',
    [userId]
  );
  if (res.rows.length === 0) return null;
  return res.rows[0];
}

export default async function ProfilePage({ params }) {
  const user = await getUserData(params.id);

  if (!user) {
    notFound(); // Triggers standard 404 template if target doesn't exist
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Profile Header Card */}
      <div style={{ backgroundColor: '#232527', border: '1px solid #393B3D', borderRadius: '8px', padding: '24px', display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '24px' }}>
        {/* Avatar Render Box Viewport */}
        <div style={{ width: '150px', height: '150px', backgroundColor: '#191B1D', borderRadius: '50%', border: '1px solid #393B3D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', color: '#BDC3C7' }}>[Avatar Render]</span>
        </div>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '28px' }}>{user.display_name}</h1>
            {user.role === 'admin' && (
              <span style={{ backgroundColor: '#d9534f', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>Admin</span>
            )}
          </div>
          <p style={{ color: '#BDC3C7', margin: '4px 0 16px 0', fontSize: '14px' }}>@{user.username}</p>
          
          {user.is_banned ? (
            <div style={{ color: '#d9534f', fontWeight: 'bold', background: 'rgba(217, 83, 79, 0.1)', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d9534f' }}>
              This account has been terminated by system moderation enforcement.
            </div>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#EAEAEA', fontSize: '14px', background: '#191B1D', padding: '12px', borderRadius: '6px', minWidth: '400px', border: '1px solid #393B3D' }}>
              {user.description || "This player hasn't added a description bio yet."}
            </p>
          )}
        </div>
      </div>

      {/* Primary Context Splits */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Creations Column */}
        <div style={{ backgroundColor: '#232527', border: '1px solid #393B3D', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '1px solid #393B3D', paddingBottom: '8px' }}>Player Creations</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
            <div style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#191B1D', borderRadius: '6px', border: '1px solid #393B3D', marginBottom: '6px' }}></div>
              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{user.username}'s Place</div>
            </div>
          </div>
        </div>

        {/* User Data/Statistics Column */}
        <div style={{ backgroundColor: '#232527', border: '1px solid #393B3D', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', borderBottom: '1px solid #393B3D', paddingBottom: '8px' }}>Statistics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#BDC3C7' }}>Joined:</span> <span>{new Date(user.created_at).toLocaleDateString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#BDC3C7' }}>Place Visits:</span> <span>0</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
