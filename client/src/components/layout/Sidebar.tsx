import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const menuItems = [
  { name: 'Home', path: '#', icon: '🏠' },
  { name: 'My Groups', path: '#', icon: '👥' },
  { name: 'Assignments', path: '/', icon: '📋', badge: 10 },
  { name: 'AI Teacher\'s Toolkit', path: '#', icon: '🤖' },
  { name: 'My Library', path: '#', icon: '📚' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}></div>
        <h1 className="h1-logo">VedaAI</h1>
      </div>

      <Link href="/create" className={styles.ctaButton}>
        <span className={styles.ctaIcon}>✦</span>
        Create Assignment
      </Link>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`${styles.menuItem} ${pathname === item.path || (pathname.startsWith('/assignment') && item.name === 'Assignments') ? styles.active : ''}`}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            <span className={styles.menuName}>{item.name}</span>
            {item.badge && <span className={styles.badge}>{item.badge}</span>}
          </Link>
        ))}
      </nav>

      <div className={styles.bottomSection}>
        <div className={styles.menuItem}>
          <span className={styles.menuIcon}>⚙️</span>
          <span className={styles.menuName}>Settings</span>
        </div>
        
        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>DPS</div>
          <div className={styles.profileInfo}>
            <div className={styles.profileName}>Delhi Public School</div>
            <div className={styles.profileLocation}>Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
