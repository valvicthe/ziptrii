export default function AdminDashboard() {
  // Hardcoded layout arrays mirroring system requirements
  const users = [
    { id: 1, name: 'Ziptrii', role: 'Admin', status: 'Active', style: {} },
    { id: 2, name: 'Playuncle Farti', role: 'Admin', status: 'Active', style: {} },
    { id: 3, name: 'BadDecisions', role: 'Admin', status: 'Active', style: {} },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#111213', minHeight: '100vh', color: '#fff' }}>
      <h1>Ziptrii Command Matrix</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#222', textAlign: 'left' }}>
            <th style={{ padding: '12px', border: '1px solid #333' }}>User ID</th>
            <th style={{ padding: '12px', border: '1px solid #333' }}>Username</th>
            <th style={{ padding: '12px', border: '1px solid #333' }}>Classification</th>
            <th style={{ padding: '12px', border: '1px solid #333' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={u.style}>
              <td style={{ padding: '12px', border: '1px solid #333' }}>{u.id}</td>
              <td style={{ padding: '12px', border: '1px solid #333' }}>{u.name}</td>
              <td style={{ padding: '12px', border: '1px solid #333' }}>{u.role}</td>
              <td style={{ padding: '12px', border: '1px solid #333' }}>{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
