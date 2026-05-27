import styles from './StepProgress.module.css';

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: Props) {
  return (
    <div className={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div 
            key={step} 
            className={`${styles.segment} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
          />
        );
      })}
    </div>
  );
}
