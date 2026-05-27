'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../../store/hooks';
import styles from './GenerationProgress.module.css';

export default function GenerationProgress() {
  const router = useRouter();
  const { generationStatus, currentAssignmentId } = useAppSelector(state => state.assessment);

  useEffect(() => {
    // If generation completes, redirect to the output page
    if (generationStatus?.status === 'completed' && currentAssignmentId) {
      setTimeout(() => {
        router.push(`/assignment/${currentAssignmentId}`);
      }, 1000); // Brief delay to show completion message
    }
  }, [generationStatus, currentAssignmentId, router]);

  if (!generationStatus || !currentAssignmentId) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
          {generationStatus.status === 'processing' || generationStatus.status === 'pending' ? (
            <div className={styles.loader} />
          ) : generationStatus.status === 'completed' ? (
            <div className={styles.successIcon}>✓</div>
          ) : (
            <div className={styles.errorIcon}>!</div>
          )}
        </div>
        
        <h3 className={styles.title}>
          {generationStatus.status === 'processing' || generationStatus.status === 'pending'
            ? 'Generating Assessment...'
            : generationStatus.status === 'completed'
            ? 'Assessment Ready!'
            : 'Generation Failed'}
        </h3>
        
        <p className={styles.message}>{generationStatus.message}</p>
        
        {generationStatus.status === 'failed' && (
          <button 
            className={styles.closeButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
