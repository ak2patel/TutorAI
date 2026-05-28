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
          <strong>{question.questionNumber}.</strong> [{question.difficulty}] {question.text} <strong>[{question.marks} {question.marks === 1 ? 'Mark' : 'Marks'}]</strong>
        </span>
      </div>

      {question.options && question.options.length > 0 && (
        <div className={styles.optionsGrid}>
          {question.options.map((opt, idx) => {
            const letter = String.fromCharCode(97 + idx); // a, b, c, d
            // Remove any existing letter prefix like "(a) " or "a) " or "a. "
            const cleanOption = opt.replace(/^\s*\(?[a-d]\)?\.?\s*/i, '').trim();
            return (
              <div key={idx} className={styles.option}>
                <span className={styles.optLetter}>({letter})</span>
                <span className={styles.optText}>{cleanOption}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
