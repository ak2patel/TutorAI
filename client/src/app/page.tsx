'use client';

import Link from 'next/link';
import { useGetAssignmentsQuery } from '@/services/api';
import styles from './page.module.css';

export default function Dashboard() {
  const { data: assignments, isLoading, error } = useGetAssignmentsQuery();

  const hasAssignments = assignments && assignments.length > 0;

  if (isLoading) {
    return (
      <div className={styles.center}>
        <p className={styles.muted}>Loading assignments...</p>
      </div>
    );
  }

  // Empty state (0 State screen from Figma)
  if (!hasAssignments) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIllustration}>
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            <rect x="30" y="10" width="60" height="75" rx="6" fill="#F0F0F0" stroke="#DADADA" strokeWidth="2"/>
            <line x1="45" y1="30" x2="75" y2="30" stroke="#DADADA" strokeWidth="3" strokeLinecap="round"/>
            <line x1="45" y1="42" x2="75" y2="42" stroke="#DADADA" strokeWidth="3" strokeLinecap="round"/>
            <line x1="45" y1="54" x2="65" y2="54" stroke="#DADADA" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="85" cy="65" r="18" fill="#FFE5E5"/>
            <path d="M79 59L91 71M91 59L79 71" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>No assignments yet</h3>
        <p className={styles.emptyDesc}>
          Create your first assignment to start collecting and grading student submissions.
          You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Link href="/create" className={styles.emptyBtn}>
          + Create Your First Assignment
        </Link>
      </div>
    );
  }

  // Filled state
  return (
    <div className={styles.dashboard}>
      <div className={styles.titleRow}>
        <div>
          <h2 className={styles.title}>Assignments</h2>
          <p className={styles.subtitle}>Manage and create assignments for your classes.</p>
        </div>
      </div>

      {/* Filter row */}
      <div className={styles.filterRow}>
        <div className={styles.filterLeft}>
          <span className={styles.filterIcon}>🔽</span>
          <span className={styles.filterLabel}>Filter By</span>
        </div>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input type="text" placeholder="Search Assignment" className={styles.searchInput}/>
        </div>
      </div>

      {/* Cards grid */}
      <div className={styles.grid}>
        {assignments.map((a) => (
          <Link href={`/assignment/${a.id || a._id}`} key={a.id || a._id} className={styles.card}>
            <div className={styles.cardTop}>
              <h4 className={styles.cardTitle}>{a.title}</h4>
              <button className={styles.cardMenu} onClick={(e) => e.preventDefault()}>⋮</button>
            </div>
            <div className={styles.cardDates}>
              <span>Assigned on : {new Date(a.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</span>
              <span>Due : {new Date(a.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Floating create button */}
      <Link href="/create" className={styles.floatingBtn}>
        + Create Assignment
      </Link>
    </div>
  );
}
