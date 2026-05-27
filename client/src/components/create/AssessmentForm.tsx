'use client';

import { useState, useEffect } from 'react';
import { useCreateAssignmentMutation } from '../../../services/api';
import { joinAssignmentRoom, leaveAssignmentRoom } from '../../../services/websocket';
import { useAppDispatch } from '../../../store/hooks';
import { setCurrentAssignmentId } from '../../../store/slices/assessmentSlice';
import type { CreateAssignmentRequest, IQuestionType } from '../../../types';

import StepProgress from './StepProgress';
import PillInput from '../ui/PillInput';
import FileUpload from './FileUpload';
import QuestionTypeRow from './QuestionTypeRow';
import Button from '../ui/Button';
import GenerationProgress from './GenerationProgress';
import styles from './AssessmentForm.module.css';

export default function AssessmentForm() {
  const dispatch = useAppDispatch();
  const [createAssignment, { isLoading }] = useCreateAssignmentMutation();
  
  // Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateAssignmentRequest>>({
    title: '',
    subject: '',
    className: '',
    dueDate: '',
    questionTypes: [{ type: 'Multiple Choice Questions', numberOfQuestions: 5, marksPerQuestion: 1 }],
    additionalInstructions: ''
  });
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState('');

  // Derived state
  const totalQuestions = formData.questionTypes?.reduce((acc, curr) => acc + curr.numberOfQuestions, 0) || 0;
  const totalMarks = formData.questionTypes?.reduce((acc, curr) => acc + (curr.numberOfQuestions * curr.marksPerQuestion), 0) || 0;

  // Cleanup websocket room on unmount
  useEffect(() => {
    return () => {
      // Just a safety cleanup
      dispatch(setCurrentAssignmentId(null));
    };
  }, [dispatch]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.subject || !formData.className || !formData.dueDate) {
        setErrorMsg('Please fill in all required fields');
        return;
      }
    }
    setErrorMsg('');
    setCurrentStep(s => Math.min(s + 1, 3));
  };

  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1));

  const handleAddQuestionType = () => {
    setFormData(prev => ({
      ...prev,
      questionTypes: [
        ...(prev.questionTypes || []),
        { type: 'Short Answer Questions', numberOfQuestions: 1, marksPerQuestion: 2 }
      ]
    }));
  };

  const handleUpdateQuestionType = (index: number, updated: IQuestionType) => {
    const newTypes = [...(formData.questionTypes || [])];
    newTypes[index] = updated;
    setFormData({ ...formData, questionTypes: newTypes });
  };

  const handleRemoveQuestionType = (index: number) => {
    if ((formData.questionTypes?.length || 0) <= 1) return;
    const newTypes = [...(formData.questionTypes || [])];
    newTypes.splice(index, 1);
    setFormData({ ...formData, questionTypes: newTypes });
  };

  const handleSubmit = async () => {
    try {
      setErrorMsg('');
      
      const payload: CreateAssignmentRequest = {
        title: formData.title!,
        subject: formData.subject!,
        className: formData.className!,
        dueDate: formData.dueDate!,
        questionTypes: formData.questionTypes!,
        totalQuestions,
        totalMarks,
        additionalInstructions: formData.additionalInstructions,
        // We would include fileContent here in a real app if the backend supported it in this endpoint
        // For this assignment, we'll append it to additionalInstructions for simplicity
      };

      if (fileContent) {
        payload.additionalInstructions = `[UPLOADED CONTENT FROM ${fileName}]:\n${fileContent}\n\n${payload.additionalInstructions || ''}`;
      }

      const response = await createAssignment(payload).unwrap();
      
      // Setup websocket listening
      dispatch(setCurrentAssignmentId(response.id));
      joinAssignmentRoom(response.id);
      
    } catch (err: any) {
      setErrorMsg(err.data?.error || err.message || 'Failed to create assignment');
    }
  };

  return (
    <div className={styles.container}>
      <GenerationProgress />
      
      <div className={styles.header}>
        <h2 className="h2-title">Create New Assignment</h2>
        <p className={styles.subtitle}>Fill in the details to generate an AI assessment</p>
      </div>

      <StepProgress currentStep={currentStep} totalSteps={3} />
      
      {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

      <div className={styles.formContent}>
        {currentStep === 1 && (
          <div className={styles.stepContainer}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Assignment Title*</label>
                <PillInput 
                  placeholder="e.g. Thermodynamics Weekly Test" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Subject*</label>
                <PillInput 
                  placeholder="e.g. Physics" 
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Class/Grade*</label>
                <PillInput 
                  placeholder="e.g. 11th Science" 
                  value={formData.className}
                  onChange={e => setFormData({...formData, className: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Due Date*</label>
                <PillInput 
                  type="date"
                  value={formData.dueDate}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className={styles.stepContainer}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Question Types</h3>
              <div className={styles.totalsBadge}>
                Total: {totalQuestions} Questions | {totalMarks} Marks
              </div>
            </div>

            <div className={styles.questionsList}>
              {formData.questionTypes?.map((qt, idx) => (
                <QuestionTypeRow 
                  key={idx}
                  data={qt}
                  onChange={(updated) => handleUpdateQuestionType(idx, updated)}
                  onRemove={() => handleRemoveQuestionType(idx)}
                />
              ))}
            </div>

            <button className={styles.addButton} onClick={handleAddQuestionType}>
              + Add Question Type
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className={styles.stepContainer}>
            <div className={styles.formGroup}>
              <label>Reference Material (Optional)</label>
              <p className={styles.helperText}>Upload syllabus, chapters, or specific notes for the AI to base questions on.</p>
              <FileUpload 
                onFileSelect={(content, name) => {
                  setFileContent(content);
                  setFileName(name);
                }}
                fileName={fileName}
              />
            </div>

            <div className={styles.formGroup} style={{ marginTop: '24px' }}>
              <label>Additional Instructions</label>
              <textarea 
                className={styles.textarea}
                placeholder="e.g. Focus mainly on the laws of thermodynamics. Make questions application-based."
                value={formData.additionalInstructions}
                onChange={e => setFormData({...formData, additionalInstructions: e.target.value})}
                rows={4}
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <Button 
          variant="secondary" 
          onClick={handleBack} 
          disabled={currentStep === 1 || isLoading}
        >
          Back
        </Button>
        
        {currentStep < 3 ? (
          <Button onClick={handleNext}>Next Step</Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={isLoading}>Generate Assessment</Button>
        )}
      </div>
    </div>
  );
}
