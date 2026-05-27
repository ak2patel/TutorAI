import React from 'react';
import styles from './PillInput.module.css';

interface PillInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export default function PillInput({ icon, className, ...props }: PillInputProps) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input className={styles.input} {...props} />
    </div>
  );
}
