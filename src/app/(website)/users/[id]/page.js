import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

async function getUserData(userId) {
  const res = await query(
    'SELECT id, username, display_name, description, role, is_banned, created_at, is_verified FROM users WHERE id = $1',
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
    <div style={{ 
      maxWidth: '960px', 
      margin: '20px auto', 
      fontFamily: '"HCo Gotham SSm", Arial, sans-serif', 
      color: '#F2F3F5',
      padding: '0 20px'
    }}>
      
      {/* 1. Header Section */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ width: '150px', height: '150px', backgroundColor: '#111214', borderRadius: '50%', border: '1px solid #313338' }}>
          {/* Avatar Render */}
        </div>
        
        <div style={{ flex: 1, paddingTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', color: '#FFFFFF' }}>{user.display_name}</h1>
            {user.is_verified && <span style={{ color: '#00A2FF', fontSize: '18px' }}>✔</span>}
          </div>
          <p style={{ margin: '4px 0 15px 0', color: '#B5BAC1', fontSize: '16px' }}>@{user.username}</p>
          
          <div style={{ display: 'flex', gap: '20px', color: '#B5BAC1', fontSize: '13px' }}>
            <div>Friends <br/> <span style={{ color: '#F2F3F5', fontWeight: 'bold' }}>0</span></div>
            <div>Followers <br/> <span style={{ color: '#F2F3F5', fontWeight: 'bold' }}>0</span></div>
            <div>Following <br/> <span style={{ color: '#F2F3F5', fontWeight: 'bold' }}>0</span></div>
          </div>
        </div>
      </div>

      {/* 2. Tabs */}
      <div style={{ borderBottom: '1px solid #313338', marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ padding: '10px 0', borderBottom: '2px solid #00A2FF', fontWeight: 'bold', color: '#FFFFFF', cursor: 'pointer' }}>About</div>
        <div style={{ padding: '10px 0', color: '#B5BAC1', cursor: 'pointer' }}>Creations</div>
      </div>

      {/* 3. About Section */}
      <div style={{ background: '#1E1F22', padding: '16px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #313338' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#FFFFFF', fontSize: '16px' }}>About</h3>
        <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', color: '#B5BAC1', margin: 0 }}>
            {user.description || "This player hasn't added a description bio yet."}
        </p>
      </div>

      {/* 4. Currently Wearing */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#FFFFFF', fontSize: '16px' }}>Currently Wearing - (Doesn't Work)</h3>
        <div style={{ display: 'flex', gap: '15px', background: '#1E1F22', padding: '15px', borderRadius: '4px', border: '1px solid #313338' }}>
          <div style={{ width: '200px', height: '200px', background: '#111214', border: '1px solid #313338', borderRadius: '4px' }}>
            {/* Main Avatar Render */}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flex: 1, alignContent: 'start' }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ aspectRatio: '1/1', background: '#111214', border: '1px solid #313338', borderRadius: '4px' }}></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 5. Friends */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0, color: '#FFFFFF', fontSize: '16px' }}>Friends (0)</h3>
        <button style={{ background: '#00A2FF', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>See All</button>
      </div>
    </div>
  );
}
