import { query } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function GroupsPage() {
  const groups = (await query('SELECT * FROM groups')).rows;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', color: '#E0E0E0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Groups</h1>
        <Link href="/groups/create" style={{ background: '#28A745', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', color: '#fff' }}>
          Create Group
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {groups.map(group => (
          <div key={group.id} style={{ background: '#1E1E1E', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{group.name}</h3>
            <p style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>{group.description}</p>
            <Link href={`/groups/${group.id}`} style={{ color: '#00A2FF', textDecoration: 'none' }}>View Group</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
