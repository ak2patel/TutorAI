import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteAssignmentMutation } from '../../../services/api';
import type { IAssignment } from '../../../types';
import styles from './AssignmentCard.module.css';

interface Props {
  assignment: IAssignment;
}

export default function AssignmentCard({ assignment }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteAssignment, { isLoading: isDeleting }] = useDeleteAssignmentMutation();
  const router = useRouter();

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(assignment.id);
    }
    setMenuOpen(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.title}>{assignment.title}</h4>
        
        <div className={styles.menuContainer}>
          <button className={styles.menuButton} onClick={handleMenuToggle}>
            ⋮
          </button>
          
          {menuOpen && (
            <div className={styles.dropdown}>
              <Link href={`/assignment/${assignment.id}`} className={styles.dropdownItem}>
                View Assignment
              </Link>
              <button 
                className={`${styles.dropdownItem} ${styles.danger}`}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.details}>
        <div className={styles.dateRow}>
          <span className={styles.dateLabel}>Assigned on:</span>
          <span className={styles.dateValue}>{formatDate(assignment.createdAt)}</span>
        </div>
        <div className={styles.dateRow}>
          <span className={styles.dateLabel}>Due:</span>
          <span className={styles.dateValue}>{formatDate(assignment.dueDate)}</span>
        </div>
      </div>
      
      <div className={styles.footer}>
        <span className={`${styles.status} ${styles[assignment.status]}`}>
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
        <span className={styles.marks}>{assignment.totalMarks} Marks</span>
      </div>
      
      {/* Overlay to close menu when clicking outside */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
