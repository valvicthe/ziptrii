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

  // Fetch user data including discord_id
  const user = (await query('SELECT username, display_name, description, discord_id FROM users WHERE id = $1', [userId])).rows[0];

  // Discord OAuth URL
  const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=1525775471260995694&response_type=code&redirect_uri=https%3A%2F%2Fziptrii.up.railway.app%2Fapi%2Fauth%2Fdiscord%2Fcallback&scope=identify`;

  // Server Action: Profile Update
  async function updateProfile(formData) {
    'use server';
    const newUsername = formData.get('username').trim();
    const newDisplayName = formData.get('displayName').trim();
    const newDescription = formData.get('description').trim();
    const userId = (await cookies()).get('userId').value;

    const taken = await query('SELECT id FROM users WHERE username = $1 AND id != $2', [newUsername, userId]);
    if (taken.rows.length > 0) throw new Error("Username already taken.");

    await query('UPDATE users SET username = $1, display_name = $2, description = $3 WHERE id = $4', [newUsername, newDisplayName, newDescription, userId]);
    revalidatePath('/settings');
  }

  // Server Action: Discord Unlink
  async function unlinkDiscord() {
    'use server';
    const userId = (await cookies()).get('userId').value;
    await query('UPDATE users SET discord_id = NULL WHERE id = $1', [userId]);
    revalidatePath('/settings');
  }

  // Server Action: Logout
  async function handleLogout() {
    'use server';
    (await cookies()).delete('userId');
    redirect('/login');
  }

  return (
    <div style={{ padding: '40px', color: '#fff', maxWidth: '500px' }}>
      <h1>Account Settings</h1>
      
      {/* Discord Integration Section */}
      <section style={{ marginTop: '30px', padding: '20px', background: '#232527', borderRadius: '8px', border: '1px solid #393B3D' }}>
        <h3 style={{ marginTop: 0 }}>Connections</h3>
        {user.discord_id ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: '#43b581', margin: 0 }}>✅ Discord Linked</p>
            <form action={unlinkDiscord}>
              <button type="submit" style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #D9534F', color: '#D9534F', borderRadius: '4px', cursor: 'pointer' }}>
                Unlink
              </button>
            </form>
          </div>
        ) : (
          <a href={discordAuthUrl} style={{ display: 'inline-block', marginTop: '10px', padding: '8px 16px', background: '#5865F2', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
            Link Discord Account
          </a>
        )}
      </section>

      {/* Profile Update Form */}
      <form action={updateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px', paddingBottom: '30px', borderBottom: '1px solid #393B3D' }}>
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
