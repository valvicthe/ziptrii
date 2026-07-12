import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Friends', 
};

export default async function FriendsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return <p>Please log in.</p>;

  // 1. Fetch Accepted Friends
  const friends = (await query(`
    SELECT u.username FROM friend_requests f
    JOIN users u ON (u.id = f.sender_id OR u.id = f.receiver_id)
    WHERE (f.sender_id = $1 OR f.receiver_id = $1)
    AND f.status = 'accepted' AND u.id != $1
  `, [userId])).rows;

  // 2. Fetch Pending Requests
  const requests = (await query(`
    SELECT f.id, u.username FROM friend_requests f
    JOIN users u ON u.id = f.sender_id
    WHERE f.receiver_id = $1 AND f.status = 'pending'
  `, [userId])).rows;

  // --- ACTIONS ---
  async function sendRequest(formData) {
    'use server';
    const targetName = formData.get('username');
    const senderId = (await cookies()).get('userId').value;
    const receiver = (await query('SELECT id FROM users WHERE username = $1', [targetName])).rows[0];
    
    if (receiver) {
      await query('INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)', [senderId, receiver.id]);
      revalidatePath('/friends');
    }
  }

  async function acceptRequest(formData) {
    'use server';
    const requestId = formData.get('requestId');
    await query("UPDATE friend_requests SET status = 'accepted' WHERE id = $1", [requestId]);
    revalidatePath('/friends');
  }

  return (
    <div style={{ padding: '30px', color: '#fff' }}>
      <h1>Friends</h1>
      
      {/* Send Request */}
      <form action={sendRequest} style={{ marginBottom: '20px' }}>
        <input name="username" placeholder="Enter username..." style={{ padding: '8px', background: '#333', color: '#fff', border: 'none' }} />
        <button type="submit" style={{ marginLeft: '10px' }}>Send Request</button>
      </form>

      {/* Incoming Requests */}
      {requests.length > 0 && <div>
        <h3>Incoming Requests</h3>
        {requests.map(req => (
          <form key={req.id} action={acceptRequest}>
            <p>{req.username} wants to be friends 
              <input type="hidden" name="requestId" value={req.id} />
              <button type="submit" style={{ marginLeft: '10px' }}>Accept</button>
            </p>
          </form>
        ))}
      </div>}

      {/* Friend List */}
      <h3>My Friends</h3>
      <ul>
        {friends.map((f, i) => <li key={i}>{f.username}</li>)}
      </ul>
    </div>
  );
}
