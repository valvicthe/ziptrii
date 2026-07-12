import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
    notFound();
  }

  return (
    <div style={{ maxWidth: '960px', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 1. Header Section */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ width: '160px', height: '160px', backgroundColor: '#ddd', borderRadius: '50%', border: '1px solid #ccc' }}>
          {/* Avatar Render */}
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0, fontSize: '32px' }}>{user.display_name}</h1>
            {user.role === 'admin' && <span style={{ color: '#0066cc', fontWeight: 'bold' }}>✓</span>}
          </div>
          <p style={{ margin: '0 0 15px 0', color: '#666' }}>@{user.username}</p>
          
          <div style={{ display: 'flex', gap: '25px', color: '#0066cc', fontWeight: 'bold', fontSize: '14px' }}>
            <div>Friends <br/> <span style={{ color: '#000' }}>0</span></div>
            <div>Followers <br/> <span style={{ color: '#000' }}>0</span></div>
            <div>Following <br/> <span style={{ color: '#000' }}>0</span></div>
          </div>
        </div>
      </div>

      {/* 2. Tabs */}
      <div style={{ borderBottom: '2px solid #ccc', marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ padding: '10px 0', borderBottom: '3px solid #0074BD', fontWeight: 'bold' }}>About</div>
        <div style={{ padding: '10px 0', color: '#666' }}>Creations</div>
      </div>

      {/* 3. About Section */}
      <div style={{ background: '#f2f2f2', padding: '15px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>About</h3>
        <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>{user.description || "hi"}</p>
        <p style={{ color: '#999', fontSize: '12px' }}>🕒 Previous Names</p>
      </div>

      {/* 4. Currently Wearing */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc' }}>Currently Wearing</h3>
        <div style={{ display: 'flex', gap: '20px', background: '#e8e8e8', padding: '15px' }}>
          <div style={{ width: '300px', height: '250px', background: '#fff', border: '1px solid #ccc' }}>
            {/* Main Avatar Render */}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flex: 1 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ width: '80px', height: '80px', background: '#fff', border: '1px solid #ccc' }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Friends */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Friends (0)</h3>
          <button style={{ background: '#0074BD', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '3px' }}>See All</button>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
           <p style={{ color: '#666' }}>No friends yet.</p>
        </div>
      </div>
    </div>
  );
}
