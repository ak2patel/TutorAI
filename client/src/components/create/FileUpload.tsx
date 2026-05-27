import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onFileSelect: (content: string, fileName: string) => void;
  fileName?: string;
}

export default function FileUpload({ onFileSelect, fileName }: FileUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Convert file to base64 or just extract text if it's a txt file for now
    // In a real app with pdf extraction on the frontend, we'd use pdf.js here
    // For this prototype, we'll read it as a Data URL to pass to the backend
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onFileSelect(result, file.name);
    };
    reader.readAsDataURL(file);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div 
      {...getRootProps()} 
      className={`${styles.container} ${isDragActive ? styles.active : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>☁️</span>
      </div>
      
      {fileName ? (
        <p className={styles.text}>
          <span className={styles.highlight}>{fileName}</span> selected
        </p>
      ) : (
        <p className={styles.text}>
          <span className={styles.highlight}>Choose a file</span> or drag & drop it here
        </p>
      )}
      
      <p className={styles.subtext}>JPEG, PNG, PDF, and TXT formats, up to 10MB</p>
      
      <button 
        type="button" 
        className={styles.browseButton}
        onClick={(e) => e.preventDefault()}
      >
        Browse File
      </button>
    </div>
  );
}
