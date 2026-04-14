import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', background: '#f5f5f5' }}>
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '14px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#000' }}>Home</Link>
        <Link href="/auth" style={{ textDecoration: 'none', color: '#000' }}>Auth</Link>
        <Link href="/places" style={{ textDecoration: 'none', color: '#000' }}>Places</Link>
        <Link href="/admin" style={{ textDecoration: 'none', color: '#000' }}>Admin</Link>
        <Link href="/bookmarks" style={{ textDecoration: 'none', color: '#000' }}>Bookmarks</Link>
      </div>
    </nav>
  );
}
