import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Settings', 
};

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  
  if (!userId) redirect('/login');

  // Added description to the SELECT query
  const user = (await query('SELECT username, display_name, description FROM users WHERE id = $1', [userId])).rows[0];

  async function updateProfile(formData) {
    'use server';
    const newUsername = formData.get('username').trim();
    const newDisplayName = formData.get('displayName').trim();
    const newDescription = formData.get('description').trim();
    const userId = (await cookies()).get('userId').value;

    // Check if username is taken by someone else
    const taken = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [newUsername, userId]);
    if (taken.rows.length > 0) throw new Error("Username already taken.");

    // Added description to the UPDATE query
    await query('UPDATE users SET username = $1, display_name = $2, description = $3 WHERE id = $4', [newUsername, newDisplayName, newDescription, userId]);
    revalidatePath('/settings');
  }

  // Server Action to handle secure logout
  async function handleLogout() {
    'use server';
    (await cookies()).delete('userId');
    redirect('/login');
  }

  return (
    <div style={{ padding: '40px', color: '#fff', maxWidth: '500px' }}>
      <h1>Account Settings</h1>
      
      {/* Profile Update Form */}
      <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px', paddingBottom: '30px', borderBottom: '1px solid #393B3D' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#BDC3C7' }}>Username</label>
          <input name="username" defaultValue={user.username} style={{ width: '100%', padding: '10px', background: '#232527', border: '1px solid #393B3D', color: '#fff', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#BDC3C7' }}>Display Name</label>
          <input name="displayName" defaultValue={user.display_name || ''} style={{ width: '100%', padding: '10px', background: '#232527', border: '1px solid #393B3D', color: '#fff', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#BDC3C7' }}>Description (About Me)</label>
          <textarea 
            name="description" 
            defaultValue={user.description || ''} 
            rows="4"
            style={{ width: '100%', padding: '10px', background: '#232527', border: '1px solid #393B3D', color: '#fff', borderRadius: '4px', resize: 'vertical' }} 
          />
        </div>
        <button type="submit" style={{ padding: '10px', background: '#00A2FF', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Save Changes
        </button>
      </form>

      {/* Logout Form */}
      <form action={handleLogout} style={{ marginTop: '30px' }}>
        <button type="submit" style={{ padding: '10px 20px', background: '#D9534F', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Log Out
        </button>
      </form>
    </div>
  );
}
