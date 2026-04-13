'use client';

import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { logout } from '@/lib/auth';

const links = [
  ['/', 'home'],
  ['/places/new', 'add-place'],
  ['/visits', 'visits'],
  ['/bookmarks', 'bookmarks'],
  ['/profile', 'profile'],
  ['/admin', 'admin'],
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-gray-300 p-2 text-xs">
      <div className="max-w-6xl mx-auto flex gap-3 items-center flex-wrap">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="hover:underline">
            {label}
          </Link>
        ))}
        {!isAuthenticated ? (
          <>
            <Link href="/login" className="ml-auto hover:underline">login</Link>
            <Link href="/register" className="hover:underline">register</Link>
          </>
        ) : (
          <button onClick={logout} className="ml-auto underline">logout</button>
        )}
      </div>
    </nav>
  );
}
