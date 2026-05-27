import Select from '../ui/Select';
import NumberStepper from '../ui/NumberStepper';
import type { IQuestionType } from '../../../types';
import styles from './QuestionTypeRow.module.css';

interface Props {
  data: IQuestionType;
  onChange: (data: IQuestionType) => void;
  onRemove: () => void;
}

const TYPE_OPTIONS = [
  { label: 'Multiple Choice Questions', value: 'Multiple Choice Questions' },
  { label: 'Short Answer Questions', value: 'Short Answer Questions' },
  { label: 'Long Answer Questions', value: 'Long Answer Questions' },
  { label: 'Diagram/Graph-Based Questions', value: 'Diagram/Graph-Based Questions' },
  { label: 'Numerical Problems', value: 'Numerical Problems' },
  { label: 'True/False', value: 'True/False' },
];

export default function QuestionTypeRow({ data, onChange, onRemove }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.selectWrapper}>
        <Select 
          options={TYPE_OPTIONS}
          value={data.type}
          onChange={(e) => onChange({ ...data, type: e.target.value })}
        />
        <button 
          className={styles.removeButton}
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          aria-label="Remove question type"
        >
          ×
        </button>
      </div>

      <div className={styles.steppers}>
        <NumberStepper 
          label="No. of Questions"
          value={data.numberOfQuestions}
          onChange={(val) => onChange({ ...data, numberOfQuestions: val })}
        />
        <NumberStepper 
          label="Marks"
          value={data.marksPerQuestion}
          onChange={(val) => onChange({ ...data, marksPerQuestion: val })}
        />
      </div>
    </div>
  );
}
