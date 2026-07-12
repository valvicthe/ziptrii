import { query } from '@/lib/db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CreateGroupPage() {
  async function createGroup(formData) {
    'use server';
    const name = formData.get('name');
    const description = formData.get('description');

    await query(
      'INSERT INTO groups (name, description) VALUES ($1, $2)',
      [name, description]
    );
    redirect('/groups');
  }

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', background: '#1E1E1E', borderRadius: '8px', border: '1px solid #333' }}>
      <h1 style={{ color: '#FFF' }}>Create a Group</h1>
      <form action={createGroup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="name" placeholder="Group Name" required style={{ padding: '10px', background: '#252525', border: '1px solid #444', color: '#FFF' }} />
        <textarea name="description" placeholder="Description" required style={{ padding: '10px', background: '#252525', border: '1px solid #444', color: '#FFF', height: '100px' }} />
        <button type="submit" style={{ padding: '12px', background: '#28A745', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Create Group
        </button>
      </form>
    </div>
  );
}
