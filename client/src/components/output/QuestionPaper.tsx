import type { IGeneratedPaper } from '../../../types';
import PaperSection from './PaperSection';
import styles from './QuestionPaper.module.css';

interface Props {
  paper: IGeneratedPaper;
  onPrint: () => void;
  onShare: () => void;
}

export default function QuestionPaper({ paper, onPrint, onShare }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button className={styles.actionButton} onClick={onPrint}>
          <span className={styles.icon}>🖨️</span> Print Paper
        </button>
        <button className={styles.actionButton} onClick={onShare}>
          <span className={styles.icon}>🔗</span> Share Link
        </button>
      </div>

      <div className={styles.paperPage}>
        <div className={styles.header}>
          <h1 className={styles.institution}>{paper.institutionName}</h1>
          <div className={styles.metaRow}>
            <span><strong>Subject:</strong> {paper.subject}</span>
            <span><strong>Class:</strong> {paper.className}</span>
          </div>
          <div className={styles.metaRow}>
            <span><strong>Time:</strong> {paper.duration}</span>
            <span><strong>Max Marks:</strong> {paper.totalMarks}</span>
          </div>
          
          <div className={styles.instructions}>
            <strong>General Instructions:</strong>
            <p>{paper.generalInstructions}</p>
          </div>
        </div>

        <div className={styles.sections}>
          {paper.sections.map((section, idx) => (
            <PaperSection key={idx} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
