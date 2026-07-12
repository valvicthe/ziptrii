'use client';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
    }
  };

  return (
    <input
      type="text"
      placeholder="Search"
      onKeyDown={handleSearch}
      style={{ 
        padding: '6px 12px', 
        borderRadius: '4px', 
        border: '1px solid #393B3D', 
        background: '#111214', 
        color: '#fff',
        marginLeft: '20px' 
      }}
    />
  );
}
