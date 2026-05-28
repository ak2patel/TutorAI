'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'Home', path: '/', icon: '⊞' },
  { name: 'My Groups', path: '/', icon: '☷' },
  { name: 'Assignments', path: '/', icon: '☰', badge: 10 },
  { name: 'AI Teacher\'s Toolkit', path: '/toolkit', icon: '☐' },
  { name: 'My Library', path: '/', icon: '♫' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="11" fill="url(#lg)"/><defs><linearGradient id="lg" x1="11" y1="0" x2="11" y2="22" gradientUnits="userSpaceOnUse"><stop stopColor="#E56820"/><stop offset="1" stopColor="#D45E3E"/></linearGradient></defs></svg>
        </div>
        <span className={styles.logoText}>VedaAI</span>
      </div>

      {/* CTA */}
      <Link href="/create" className={styles.ctaButton}>
        <span className={styles.ctaStar}>✦</span>
        Create Assignment
      </Link>

      {/* Nav */}
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (pathname.startsWith('/assignment') && item.name === 'Assignments') || (pathname === '/create' && item.name === 'Assignments');
          return (
            <Link key={item.name} href={item.path} className={`${styles.menuItem} ${isActive ? styles.active : ''}`}>
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuName}>{item.name}</span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={styles.bottomSection}>
        <Link href="/settings" className={styles.menuItem}>
          <span className={styles.menuIcon}>⚙</span>
          <span className={styles.menuName}>Settings</span>
        </Link>
        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="18" fill="#E0E0E0"/><circle cx="18" cy="14" r="6" fill="#999"/><ellipse cx="18" cy="30" rx="10" ry="7" fill="#999"/></svg>
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Delhi Public School</span>
            <span className={styles.profileLocation}>Bokaro Steel City</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
