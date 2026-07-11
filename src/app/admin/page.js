import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Data fetching directly inside the Next.js server context
async function getAllUsers() {
  const res = await query('SELECT id, username, display_name, role, is_banned, ban_reason FROM users ORDER BY id ASC');
  return res.rows;
}

export default async function AdminDashboard() {
  const users = await getAllUsers();

  // Next.js Server Actions to handle bans/pardons instantly from the UI row
  async function toggleUserBan(formData) {
    'use server';
    const userId = formData.get('userId');
    const currentStatus = formData.get('isBanned') === 'true';

    if (currentStatus) {
      // Pardon account execution map
      await query('UPDATE users SET is_banned = false, ban_reason = \'\' WHERE id = $1', [userId]);
    } else {
      // Ban execution map (handles user ID 12 or others violations)
      await query('UPDATE users SET is_banned = true, ban_reason = \'Administrative Enforcement Violation\' WHERE id = $1', [userId]);
    }
    revalidatePath('/admin'); // Force Next.js cache update
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#111213', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0 }}>Ziptrii Moderation Suite</h1>
        <a href="/" style={{ color: '#00A2FF', textDecoration: 'none', fontSize: '14px' }}>← Back to Website</a>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#1c1d1f', border: '1px solid #333' }}>
        <thead>
          <tr style={{ background: '#222', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #333' }}>User ID</th>
            <th style={{ padding: '12px', border: '1px solid #333' }}>Username</th>
            <th style={{ padding: '12px', border: '1px solid #333' }}>Classification</th>
            <th style={{ padding: '12px', border: '1px solid #333' }}>Status</th>
            <th style={{ padding: '12px', border: '1px solid #333' }}>Enforcement Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #333', color: user.is_banned ? '#d9534f' : '#fff' }}>
              <td style={{ padding: '12px', border: '1px solid #333' }}>{user.id}</td>
              <td style={{ padding: '12px', border: '1px solid #333', fontWeight: 'bold' }}>{user.username}</td>
              <td style={{ padding: '12px', border: '1px solid #333' }}>
                <span style={{ backgroundColor: user.role === 'admin' ? '#d9534f' : '#393B3D', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>
                  {user.role}
                </span>
              </td>
              <td style={{ padding: '12px', border: '1px solid #333' }}>
                {user.is_banned ? `Banned (${user.ban_reason})` : 'Active'}
              </td>
              <td style={{ padding: '12px', border: '1px solid #333' }}>
                {user.id === 1 || user.id === 2 ? (
                  <span style={{ fontSize: '12px', color: '#BDC3C7', fontStyle: 'italic' }}>Protected System Account</span>
                ) : (
                  <form action={toggleUserBan}>
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="isBanned" value={user.is_banned.toString()} />
                    <button 
                      type="submit" 
                      style={{ 
                        background: user.is_banned ? '#5cb85c' : '#d9534f', 
                        color: 'white', border: 'none', padding: '6px 12px', 
                        borderRadius: '4px', cursor: 'pointer', fontSize: '13px' 
                      }}
                    >
                      {user.is_banned ? 'Pardon Account' : 'Terminate Account'}
                    </button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
