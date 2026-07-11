export default function GameCard({ title, rating, playing }) {
  return (
    <div style={{ cursor: 'pointer' }}>
      <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#232527', borderRadius: '8px', border: '1px solid #393B3D' }}></div>
      <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '8px', textOverflow: 'ellipsis', white-space: 'nowrap', overflow: 'hidden' }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#BDC3C7', marginTop: '4px' }}>
        <span>👍 {rating}</span>
        <span>👥 {playing}</span>
      </div>
    </div>
  );
}
