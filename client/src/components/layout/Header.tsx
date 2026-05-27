'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const pathname = usePathname();

  // Determine breadcrumbs based on route
  let breadcrumb = 'Assignments';
  if (pathname === '/create') breadcrumb = 'Create Assignment';
  else if (pathname.startsWith('/assignment/')) breadcrumb = 'Generated Paper';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {pathname !== '/' && (
          <Link href="/" className={styles.backButton}>
            ←
          </Link>
        )}
        <h2 className="h2-title">{breadcrumb}</h2>
      </div>

      <div className={styles.right}>
        <button className={styles.iconButton} aria-label="Notifications">
          🔔
        </button>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>JD</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>John Doe</span>
            <span className={styles.userRole}>Teacher</span>
          </div>
        </div>
      </div>
    </header>
  );
}
