import React from 'react';
import styles from './NumberStepper.module.css';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export default function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 100,
  label
}: NumberStepperProps) {
  
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.stepper}>
        <button 
          className={styles.button} 
          onClick={handleDecrement}
          disabled={value <= min}
        >
          -
        </button>
        <span className={styles.value}>{value}</span>
        <button 
          className={styles.button} 
          onClick={handleIncrement}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
