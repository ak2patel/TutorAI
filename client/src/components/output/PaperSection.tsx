import type { ISection } from '../../types';
import PaperQuestion from './PaperQuestion';
import styles from './PaperSection.module.css';

interface Props {
  section: ISection;
}

export default function PaperSection({ section }: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        <div className={styles.metaRow}>
          <span className={styles.type}>{section.type}</span>
          <span className={styles.instruction}>
            {section.instruction || `Attempt all questions. Each question carries ${section.marksPerQuestion} marks`}
          </span>
        </div>
      </div>

      <div className={styles.questionsList}>
        {section.questions.map((q, idx) => (
          <PaperQuestion key={idx} question={q} />
        ))}
      </div>
    </div>
  );
}
