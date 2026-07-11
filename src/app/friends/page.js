export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export default async function FriendsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) return <p>Please log in.</p>;

  // Fetch list of friends
  const friends = (await query(`
    SELECT u.username 
    FROM friends f
    JOIN users u ON f.friend_id = u.id
    WHERE f.user_id = $1
  `, [userId])).rows;

  async function addFriend(formData) {
    'use server';
    const targetUsername = formData.get('username');
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    try {
      // Find the user ID of the person we are trying to add
      const targetUser = (await query('SELECT id FROM users WHERE username = $1', [targetUsername])).rows[0];
      if (!targetUser) throw new Error("User not found");
      if (targetUser.id.toString() === userId) throw new Error("Cannot add yourself");

      // Add to friends table
      await query('INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)', [userId, targetUser.id]);
      await query('INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)', [targetUser.id, userId]);
      
      revalidatePath('/friends');
    } catch (error) {
      console.error("FRIEND ERROR:", error.message);
    }
  }

  return (
    <div style={{ padding: '30px', color: '#fff' }}>
      <h1>My Friends</h1>
      
      <form action={addFriend} style={{ marginBottom: '20px' }}>
        <input name="username" placeholder="Enter username..." style={{ padding: '8px', background: '#333', color: '#fff', border: '1px solid #555' }} />
        <button type="submit" style={{ marginLeft: '10px' }}>Add Friend</button>
      </form>

      <ul style={{ listStyle: 'none' }}>
        {friends.map((f, i) => (
          <li key={i} style={{ padding: '10px', background: '#222', marginBottom: '5px', borderRadius: '4px' }}>
            {f.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
