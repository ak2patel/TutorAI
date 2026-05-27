'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileNav.module.css';

const navItems = [
  { name: 'Home', path: '#', icon: '🏠' },
  { name: 'Assignments', path: '/', icon: '📋' },
  { name: 'Library', path: '#', icon: '📚' },
  { name: 'Toolkit', path: '#', icon: '🤖' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Floating Create Button */}
      {pathname === '/' && (
        <Link href="/create" className={styles.fab}>
          +
        </Link>
      )}

      {/* Bottom Navigation Bar */}
      <nav className={styles.mobileNav}>
        {navItems.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith('/assignment') && item.name === 'Assignments');
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
