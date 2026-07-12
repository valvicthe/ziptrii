export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  // 1. Force Redirect immediately if not logged in
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    redirect('/login');
  }

  // 2. Fetch logged-in user's details
  const user = (await query('SELECT username FROM users WHERE id = $1', [userId])).rows[0];
  
  // If user exists in cookie but was deleted from DB, send them back to login
  if (!user) redirect('/login');

  // 3. Fetch the user's friends
  const friends = (await query(`
    SELECT u.id, u.username 
    FROM friend_requests f
    JOIN users u ON (u.id = f.sender_id OR u.id = f.receiver_id)
    WHERE (f.sender_id = $1 OR f.receiver_id = $1)
    AND f.status = 'accepted' AND u.id != $1
  `, [userId])).rows;

  return (
    <div className="home-container">
      {/* Sub-Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #313338' }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          Hello, {user.username}!
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ border: '1px solid #0074BD', borderRadius: '3px', padding: '4px 10px', backgroundColor: '#E5F3FF', fontWeight: '700', fontSize: '12px', color: '#0074BD' }}>
            Ziptrii (Beta)
          </div>
          
          <Link href="/settings" style={{ fontSize: '22px', color: '#B5BAC1', textDecoration: 'none' }}>
            ⚙️
          </Link>
        </div>
      </div>

      {/* --- Friends Section --- */}
      <section className="home-section">
        <div className="section-header">
          <h2>Friends ({friends.length})</h2>
          <Link href="/friends" className="see-all">See All →</Link>
        </div>
        
        <div className="friends-row">
          <Link href="/friends" style={{ textDecoration: 'none' }}>
            <div className="friend-card add-friend-card">
              <div className="add-friend-btn">+</div>
              <span className="friend-name">Add Friends</span>
            </div>
          </Link>

          {friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <div className="friend-avatar">
                <div className="status-badge">👤</div>
              </div>
              <span className="friend-name">{friend.username}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- Recently Played Section --- */}
      <section className="home-section">
        <div className="section-header">
          <h2>Recently Played</h2>
        </div>
        
        <div className="game-placeholder" style={{ maxWidth: '100%', padding: '40px', textAlign: 'center', border: '1px dashed #313338', borderRadius: '8px', color: '#B5BAC1' }}>
          <p>No Recently Played Games!</p>
        </div>
      </section>
    </div>
  );
}
