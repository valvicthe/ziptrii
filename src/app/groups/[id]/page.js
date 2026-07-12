import { query } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function GroupPage({ params }) {
  // Fetch specific group
  const { id } = params;
  const result = await query('SELECT * FROM groups WHERE id = $1', [id]);
  const group = result.rows[0];

  if (!group) {
    notFound();
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#E0E0E0' }}>
      <div style={{ background: '#1E1E1E', padding: '30px', borderRadius: '8px', border: '1px solid #333' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#FFF' }}>{group.name}</h1>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>
          Created on: {new Date(group.created_at).toLocaleDateString()}
        </p>
        
        <div style={{ borderTop: '1px solid #333', paddingTop: '20px' }}>
          <h3 style={{ color: '#FFF' }}>Description</h3>
          <p style={{ lineHeight: '1.6' }}>{group.description}</p>
        </div>

        {/* Placeholder for member actions */}
        <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
            <button style={{ padding: '10px 20px', background: '#00A2FF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Join Group
            </button>
        </div>
      </div>
    </div>
  );
}
