import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// DIAGNOSTIC VERSION: Checks session and logs status to your terminal
async function getAdminSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  console.log("ADMIN DEBUG: Cookie userId found:", userId);

  if (!userId) {
    console.log("ADMIN DEBUG: No userId cookie found.");
    return null;
  }

  // Ensure we are querying correctly. 
  // If your ID is a UUID/String, remove 'parseInt'. 
  // If your ID is an Integer, keep 'parseInt'.
  const res = await query('SELECT role FROM users WHERE id = $1 AND role = $2', [parseInt(userId), 'admin']);
  
  if (res.rows.length === 0) {
    console.log("ADMIN DEBUG: User ID", userId, "is NOT an admin in the database.");
    return null;
  }

  console.log("ADMIN DEBUG: Access Granted for User ID:", userId);
  return res.rows[0];
}

export default async function AdminDashboard() {
  // 1. Force Auth Check
  const admin = await getAdminSession();
  if (!admin) {
    console.log("ADMIN DEBUG: Redirecting to home due to failed auth.");
    redirect('/');
  }

  // 2. Fetch Users
  const res = await query('SELECT id, username, display_name, role, is_banned, ban_reason FROM users ORDER BY id ASC');
  const users = res.rows;

  // 3. Server Action
  async function toggleUserBan(formData) {
    'use server';
    
    const session = await getAdminSession();
    if (!session) throw new Error("Unauthorized");

    const userId = formData.get('userId');
    const currentStatus = formData.get('isBanned') === 'true';

    if (userId === '1' || userId === '2') return;

    if (currentStatus) {
      await query('UPDATE users SET is_banned = false, ban_reason = \'\' WHERE id = $1', [userId]);
    } else {
      await query('UPDATE users SET is_banned = true, ban_reason = \'Administrative Enforcement Violation\' WHERE id = $1', [userId]);
    }
    revalidatePath('/admin');
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
