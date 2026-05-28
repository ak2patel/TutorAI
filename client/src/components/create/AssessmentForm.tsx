'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateAssignmentMutation } from '../../services/api';
import { joinAssignmentRoom } from '../../services/websocket';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentAssignmentId, setGenerationStatus } from '../../store/slices/assessmentSlice';
import type { CreateAssignmentRequest, IQuestionType } from '../../types';
import styles from './AssessmentForm.module.css';

const QUESTION_TYPE_OPTIONS = [
  'Multiple Choice Questions',
  'Short Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Long Answer Questions',
  'True/False',
];

export default function AssessmentForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [createAssignment, { isLoading }] = useCreateAssignmentMutation();
  const { generationStatus, currentAssignmentId } = useAppSelector(s => s.assessment);

  const [formData, setFormData] = useState<Partial<CreateAssignmentRequest>>({
    title: '',
    subject: '',
    className: '',
    dueDate: '',
    questionTypes: [
      { type: 'Multiple Choice Questions', numberOfQuestions: 4, marksPerQuestion: 1 },
      { type: 'Short Questions', numberOfQuestions: 3, marksPerQuestion: 2 },
      { type: 'Diagram/Graph-Based Questions', numberOfQuestions: 5, marksPerQuestion: 5 },
      { type: 'Numerical Problems', numberOfQuestions: 5, marksPerQuestion: 5 },
    ],
    additionalInstructions: '',
  });
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const totalQuestions = formData.questionTypes?.reduce((a, c) => a + c.numberOfQuestions, 0) || 0;
  const totalMarks = formData.questionTypes?.reduce((a, c) => a + c.numberOfQuestions * c.marksPerQuestion, 0) || 0;

  // Redirect to output page when generation completes
  useEffect(() => {
    if (generationStatus?.status === 'completed' && currentAssignmentId) {
      setTimeout(() => {
        router.push(`/assignment/${currentAssignmentId}`);
      }, 800);
    }
  }, [generationStatus, currentAssignmentId, router]);

  useEffect(() => {
    return () => { dispatch(setCurrentAssignmentId(null)); };
  }, [dispatch]);

  const handleAddQuestionType = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      questionTypes: [
        ...(prev.questionTypes || []),
        { type: 'Long Answer Questions', numberOfQuestions: 1, marksPerQuestion: 2 },
      ],
    }));
  };

  const handleRemoveQuestionType = (index: number) => {
    if ((formData.questionTypes?.length || 0) <= 1) return;
    const newTypes = [...(formData.questionTypes || [])];
    newTypes.splice(index, 1);
    setFormData({ ...formData, questionTypes: newTypes });
  };

  const updateQT = (index: number, field: keyof IQuestionType, value: string | number) => {
    const newTypes = [...(formData.questionTypes || [])];
    newTypes[index] = { ...newTypes[index], [field]: value };
    setFormData({ ...formData, questionTypes: newTypes });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.dueDate) {
      setErrorMsg('Due date is required.');
      return;
    }
    if ((formData.questionTypes?.length || 0) === 0) {
      setErrorMsg('Add at least one question type.');
      return;
    }

    try {
      const payload: CreateAssignmentRequest = {
        title: formData.title || `${formData.subject || 'General'} Assessment`,
        subject: formData.subject || 'General',
        className: formData.className || '5th',
        dueDate: formData.dueDate,
        questionTypes: formData.questionTypes!,
        totalQuestions,
        totalMarks,
        additionalInstructions: formData.additionalInstructions,
      };

      dispatch(setGenerationStatus({ status: 'pending', message: 'Creating assignment...' }));
      const response = await createAssignment(payload).unwrap();
      dispatch(setCurrentAssignmentId(response.id || (response as any)._id));
      dispatch(setGenerationStatus({ status: 'processing', message: 'AI is generating your question paper...' }));
      joinAssignmentRoom(response.id || (response as any)._id);
    } catch (err: any) {
      dispatch(setGenerationStatus({ status: 'failed', message: err.data?.error || 'Failed to create' }));
      setErrorMsg(err.data?.error || err.message || 'Failed to create assignment');
    }
  };

  const isGenerating = generationStatus?.status === 'processing' || generationStatus?.status === 'pending';

  return (
    <>
      {/* Generation overlay */}
      {isGenerating && (
        <div className={styles.overlay}>
          <div className={styles.overlayCard}>
            <div className={styles.spinner} />
            <h3 className={styles.overlayTitle}>Generating Assessment...</h3>
            <p className={styles.overlayMsg}>{generationStatus?.message}</p>
          </div>
        </div>
      )}

      {generationStatus?.status === 'failed' && (
        <div className={styles.overlay}>
          <div className={styles.overlayCard}>
            <div className={styles.errorCircle}>!</div>
            <h3 className={styles.overlayTitle}>Generation Failed</h3>
            <p className={styles.overlayMsg}>{generationStatus?.message}</p>
            <button className={styles.retryBtn} onClick={() => {
              dispatch(setGenerationStatus({ status: 'pending', message: '' }));
              dispatch(setCurrentAssignmentId(null));
              window.location.reload();
            }}>Try Again</button>
          </div>
        </div>
      )}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        {/* Progress indicator */}
        <div className={styles.progressBar}>
          <div className={styles.progressStep}>
            <div className={styles.progressDot} />
            <div className={styles.progressText}>
              <div className={styles.progressTitle}>Create Assignment</div>
              <div className={styles.progressSubtitle}>Set up a new assignment for your students</div>
            </div>
          </div>
          <div className={styles.progressLine} />
          <div className={styles.progressLineInactive} />
        </div>

        {/* Section: Assignment Details */}
        <h3 className={styles.sectionTitle}>Assignment Details</h3>
        <p className={styles.sectionSubtitle}>Basic information about your assignment</p>

        {/* File Upload */}
        <label className={styles.uploadZone} htmlFor="fileUpload">
          <div className={styles.uploadIcon}>☁️</div>
          <p className={styles.uploadText}>
            {fileName ? <><strong>{fileName}</strong> selected</> : <>Choose a file or drag &amp; drop it here</>}
          </p>
          <p className={styles.uploadHint}>JPEG, PNG, upto 10MB</p>
          <span className={styles.browseBtn}>Browse Files</span>
          <input type="file" id="fileUpload" accept=".pdf,.txt,.jpg,.jpeg,.png" onChange={handleFileChange} hidden />
        </label>
        <p className={styles.uploadCaption}>Upload images of your preferred document/image</p>

        {/* Due Date */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Due Date</span>
          <input
            type="date"
            className={styles.pillInput}
            value={formData.dueDate}
            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            placeholder="DD-MM-YYYY"
          />
        </div>

        {/* Question Types */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Question Type</span>
          <div className={styles.qtHeader}>
            <span className={styles.qtHeaderLabel}></span>
            <span className={styles.qtHeaderLabel}>No. of Questions</span>
            <span className={styles.qtHeaderLabel}>Marks</span>
          </div>

          {formData.questionTypes?.map((qt, idx) => (
            <div className={styles.qtRow} key={idx}>
              <div className={styles.qtSelectWrap}>
                <select
                  className={styles.qtSelect}
                  value={qt.type}
                  onChange={e => updateQT(idx, 'type', e.target.value)}
                >
                  {QUESTION_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button type="button" className={styles.qtRemove} onClick={() => handleRemoveQuestionType(idx)} aria-label="Remove question type">×</button>
              </div>
              <div className={styles.qtStepperWrap}>
                <span className={styles.qtMobileLabel}>No. of Questions</span>
                <div className={styles.qtStepper}>
                  <button type="button" onClick={() => updateQT(idx, 'numberOfQuestions', Math.max(1, qt.numberOfQuestions - 1))} aria-label="Decrease questions">−</button>
                  <span>{qt.numberOfQuestions}</span>
                  <button type="button" onClick={() => updateQT(idx, 'numberOfQuestions', qt.numberOfQuestions + 1)} aria-label="Increase questions">+</button>
                </div>
              </div>
              <div className={styles.qtStepperWrap}>
                <span className={styles.qtMobileLabel}>Marks</span>
                <div className={styles.qtStepper}>
                  <button type="button" onClick={() => updateQT(idx, 'marksPerQuestion', Math.max(1, qt.marksPerQuestion - 1))} aria-label="Decrease marks">−</button>
                  <span>{qt.marksPerQuestion}</span>
                  <button type="button" onClick={() => updateQT(idx, 'marksPerQuestion', qt.marksPerQuestion + 1)} aria-label="Increase marks">+</button>
                </div>
              </div>
            </div>
          ))}

          <button type="button" className={styles.addTypeBtn} onClick={handleAddQuestionType}>
            <span className={styles.addIcon}>+</span> Add Question Type
          </button>
        </div>

        {/* Totals */}
        <div className={styles.totalsRow}>
          <span>Total Questions : <strong>{totalQuestions}</strong></span>
          <span>Total Marks : <strong>{totalMarks}</strong></span>
        </div>

        {/* Additional Instructions */}
        <div className={styles.fieldGroup}>
          <span className={styles.fieldLabel}>Additional Information (For better output)</span>
          <div className={styles.textareaWrap}>
            <textarea
              className={styles.textarea}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              value={formData.additionalInstructions}
              onChange={e => setFormData({ ...formData, additionalInstructions: e.target.value })}
              rows={3}
            />
            <span className={styles.textareaIcon}>🎤</span>
          </div>
        </div>

        {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

        {/* Footer Buttons */}
        <div className={styles.footer}>
          <button type="button" className={styles.prevBtn} onClick={() => router.push('/')}>← Previous</button>
          <button type="submit" className={styles.nextBtn} disabled={isLoading || isGenerating}>
            {isLoading ? 'Submitting...' : 'Next →'}
          </button>
        </div>
      </form>
    </>
  );
}
