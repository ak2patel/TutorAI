import Link from 'next/link';
import styles from './EmptyState.module.css';

export default function EmptyState() {
  return (
    <div className={styles.container}>
      <div className={styles.illustration}>
        {/* Placeholder for Figma Illustration */}
        <div className={styles.placeholderCircle}>
          <span className={styles.emoji}>📝</span>
        </div>
      </div>
      
      <h3 className={styles.title}>No assignments yet</h3>
      <p className={styles.description}>
        You haven&apos;t created any assignments yet. Start by creating your first AI-generated question paper.
      </p>
      
      <Link href="/create" className={styles.createButton}>
        + Create Your First Assignment
      </Link>
    </div>
  );
}
