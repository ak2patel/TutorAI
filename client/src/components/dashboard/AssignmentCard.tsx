import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteAssignmentMutation, useUpdateAssignmentMutation } from '../../services/api';
import type { IAssignment } from '../../types';
import styles from './AssignmentCard.module.css';

interface Props {
  assignment: IAssignment;
}

export default function AssignmentCard({ assignment }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(assignment.title);
  const [deleteAssignment, { isLoading: isDeleting }] = useDeleteAssignmentMutation();
  const [updateAssignment, { isLoading: isUpdating }] = useUpdateAssignmentMutation();
  const router = useRouter();

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRenaming(true);
    setMenuOpen(false);
  };

  const handleSaveRename = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (newTitle.trim() && newTitle.trim() !== assignment.title) {
      try {
        await updateAssignment({ 
          id: (assignment.id || assignment._id) as string, 
          title: newTitle.trim() 
        }).unwrap();
      } catch (error) {
        console.error('Failed to update assignment:', error);
        alert('Failed to update assignment title');
      }
    }
    
    setIsRenaming(false);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNewTitle(assignment.title);
    setIsRenaming(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment((assignment.id || assignment._id) as string);
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
        {isRenaming ? (
          <form onSubmit={handleSaveRename} className={styles.renameForm}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className={styles.renameInput}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              disabled={isUpdating}
            />
            <div className={styles.renameActions}>
              <button 
                type="submit" 
                className={styles.saveBtn} 
                onClick={(e) => e.stopPropagation()}
                disabled={isUpdating}
              >
                ✓
              </button>
              <button 
                type="button" 
                className={styles.cancelBtn} 
                onClick={handleCancelRename}
                disabled={isUpdating}
              >
                ✕
              </button>
            </div>
          </form>
        ) : (
          <>
            <h4 className={styles.title}>{assignment.title}</h4>
            
            <div className={styles.menuContainer}>
              <button className={styles.menuButton} onClick={handleMenuToggle}>
                ⋮
              </button>
              
              {menuOpen && (
                <div className={styles.dropdown}>
                  <button 
                    className={styles.dropdownItem}
                    onClick={handleRename}
                  >
                    Rename
                  </button>
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
          </>
        )}
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
      
      {/* Overlay to close menu when clicking outside */}
      {menuOpen && (
        <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}
