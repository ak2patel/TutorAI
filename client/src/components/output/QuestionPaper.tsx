import type { IGeneratedPaper } from '../../types';
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
      <div className={styles.darkBanner}>
        <div className={styles.bannerContent}>
          <p className={styles.bannerText}>
            Certainly, Lakshya! Here are customized <strong>Question Paper</strong> for your CBSE {paper.className} {paper.subject} classes on the NCERT chapters:
          </p>
          <button className={styles.downloadBtn} onClick={onPrint}>
            <span className={styles.icon}>📥</span> Download as PDF
          </button>
        </div>
      </div>

      <div className={styles.paperWrapper}>
        <div className={styles.paperPage}>
          <div className={styles.header}>
            <h1 className={styles.institution}>{paper.institutionName}</h1>
            <p className={styles.subject}>Subject: {paper.subject}</p>
            <p className={styles.class}>Class: {paper.className}</p>

            <div className={styles.metaRow}>
              <span>Time Allowed: {paper.duration}</span>
              <span>Maximum Marks: {paper.totalMarks}</span>
            </div>

            <p className={styles.generalInstructions}>
              {paper.generalInstructions || 'All questions are compulsory unless stated otherwise.'}
            </p>

            <div className={styles.studentDetails}>
              <p>Name: _______________________</p>
              <p>Roll Number: ________________</p>
              <p>Class: {paper.className} Section: ___________</p>
            </div>
          </div>

          <div className={styles.sections}>
            {paper.sections.map((section, idx) => (
              <PaperSection key={idx} section={section} />
            ))}
          </div>

          {paper.answerKey && paper.answerKey.length > 0 && (
            <div className={styles.answerKey}>
              <h3>Answer Key:</h3>
              <ol>
                {paper.answerKey.map((ans, idx) => (
                  <li key={idx}><strong>{ans.questionNumber}.</strong> {ans.answer}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
