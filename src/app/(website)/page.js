export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) redirect('/login');

  const user = (await query('SELECT username FROM users WHERE id = $1', [userId])).rows[0];
  if (!user) redirect('/login');

  const friends = (await query(`
    SELECT u.id, u.username 
    FROM friend_requests f
    JOIN users u ON (u.id = f.sender_id OR u.id = f.receiver_id)
    WHERE (f.sender_id = $1 OR f.receiver_id = $1)
    AND f.status = 'accepted' AND u.id != $1
  `, [userId])).rows;

  return (
    <div className="home-container">
      {/* Header */}
      <div style={{ marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid #313338' }}>
        <h1 className="page-title" style={{ margin: 0, color: '#FFFFFF' }}>
          Hello, {user.username}!
        </h1>
      </div>

      {/* --- Friends Section --- */}
      <section className="home-section" style={{ marginBottom: '30px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <h2 style={{ fontSize: '18px', color: '#FFFFFF' }}>Friends ({friends.length})</h2>
          <Link href="/friends" style={{ color: '#00A2FF', textDecoration: 'none' }}>See All</Link>
        </div>
        
        <div className="friends-row" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link href="/friends" style={{ textDecoration: 'none' }}>
            <div className="friend-card" style={{ padding: '15px', background: '#1E1F22', border: '1px solid #313338', borderRadius: '4px', textAlign: 'center', width: '100px' }}>
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>+</div>
              <span style={{ fontSize: '12px', color: '#B5BAC1' }}>Add</span>
            </div>
          </Link>

          {friends.map((friend) => (
            <Link key={friend.id} href={`/users/${friend.id}`} style={{ textDecoration: 'none' }}>
              <div className="friend-card" style={{ padding: '15px', background: '#1E1F22', border: '1px solid #313338', borderRadius: '4px', textAlign: 'center', width: '100px' }}>
                <div className="friend-avatar" style={{ fontSize: '24px', marginBottom: '5px' }}>👤</div>
                <span style={{ fontSize: '12px', color: '#F2F3F5', fontWeight: 'bold' }}>{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- Groups Section (New) --- */}
      <section className="home-section" style={{ marginBottom: '30px' }}>
        <div className="section-header">
          <h2 style={{ fontSize: '18px', color: '#FFFFFF' }}>My Groups</h2>
        </div>
        <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #313338', borderRadius: '4px', color: '#B5BAC1' }}>
          <p>You aren't in any groups yet.</p>
        </div>
      </section>

      {/* --- Recently Played Section --- */}
      <section className="home-section">
        <div className="section-header">
          <h2 style={{ fontSize: '18px', color: '#FFFFFF' }}>Recently Played</h2>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #313338', borderRadius: '4px', color: '#B5BAC1' }}>
          <p>No Recently Played Games!</p>
        </div>
      </section>
    </div>
  );
}
