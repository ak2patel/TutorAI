import type { IQuestion } from '../../types';
import styles from './PaperQuestion.module.css';

interface Props {
  question: IQuestion;
}

export default function PaperQuestion({ question }: Props) {
  return (
    <div className={styles.questionContainer}>
      <div className={styles.questionTextRow}>
        <span className={styles.qText}>
          {question.questionNumber}. [{question.difficulty}] {question.text} [{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]
        </span>
      </div>

      {question.options && question.options.length > 0 && (
        <div className={styles.optionsGrid}>
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(97 + idx); // a, b, c, d
            return (
              <div key={idx} className={styles.option}>
                <span className={styles.optLetter}>({letter})</span>
                <span className={styles.optText}>{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
