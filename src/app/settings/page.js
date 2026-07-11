export const dynamic = 'force-dynamic';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Settings', // This will result in "Avatar Shop | Ziptrii"
};

export default async function SettingsPage() {
  const userId = (await cookies()).get('userId')?.value;
  if (!userId) redirect('/login');

  const user = (await query('SELECT username, display_name FROM users WHERE id = $1', [userId])).rows[0];

  async function updateProfile(formData) {
    'use server';
    const newUsername = formData.get('username').trim();
    const newDisplayName = formData.get('displayName').trim();
    const userId = (await cookies()).get('userId').value;

    // Check if username is taken by someone else
    const taken = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [newUsername, userId]);
    if (taken.rows.length > 0) throw new Error("Username already taken.");

    await query('UPDATE users SET username = $1, display_name = $2 WHERE id = $3', [newUsername, newDisplayName, userId]);
    revalidatePath('/settings');
  }

  return (
    <div style={{ padding: '40px', color: '#fff', maxWidth: '500px' }}>
      <h1>Account Settings</h1>
      <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#BDC3C7' }}>Username</label>
          <input name="username" defaultValue={user.username} style={{ width: '100%', padding: '10px', background: '#232527', border: '1px solid #393B3D', color: '#fff', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#BDC3C7' }}>Display Name</label>
          <input name="displayName" defaultValue={user.display_name || ''} style={{ width: '100%', padding: '10px', background: '#232527', border: '1px solid #393B3D', color: '#fff', borderRadius: '4px' }} />
        </div>
        <button type="submit" style={{ padding: '10px', background: '#00A2FF', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
