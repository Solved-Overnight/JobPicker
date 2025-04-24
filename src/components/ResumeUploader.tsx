import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface ResumeUploaderProps {
  onResumeUpload: (resume: File) => Promise<void>;
  darkMode: boolean;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeUpload, darkMode }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadStatus('uploading');
      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(i);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        await onResumeUpload(file);
        setUploadStatus('success');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to upload resume');
        setUploadStatus('error');
      }
    } else {
      setErrorMessage('Please upload a PDF file');
      setUploadStatus('error');
    }
  }, [onResumeUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-surface-800' : 'bg-white'} shadow-lg`}>
      <h3 className="text-xl font-semibold mb-4">Upload Your Resume</h3>
      
      <AnimatePresence mode="wait">
        {uploadStatus === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? darkMode ? 'border-primary-400 bg-surface-700' : 'border-primary-500 bg-primary-50'
                : darkMode ? 'border-surface-600 hover:border-primary-500' : 'border-gray-300 hover:border-primary-400'
              }`}
          >
            <input {...getInputProps()} />
            <Upload className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? 'text-primary-400' : 'text-primary-500'
            }`} />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
            </p>
            <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
              or click to select a PDF file
            </p>
          </motion.div>
        )}

        {uploadStatus === 'uploading' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center p-8"
          >
            <div className="w-24 h-24 mb-4">
              <CircularProgressbar
                value={uploadProgress}
                text={`${uploadProgress}%`}
                styles={buildStyles({
                  pathColor: darkMode ? '#38bdf8' : '#0ea5e9',
                  textColor: darkMode ? '#e0f2fe' : '#0ea5e9',
                  trailColor: darkMode ? '#1e293b' : '#f1f5f9'
                })}
              />
            </div>
            <p className="text-lg font-medium">Processing your resume...</p>
          </motion.div>
        )}

        {uploadStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center p-8"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-lg font-medium">Resume uploaded successfully!</p>
            <button
              onClick={() => setUploadStatus('idle')}
              className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium
                ${darkMode 
                  ? 'bg-surface-700 hover:bg-surface-600 text-white' 
                  : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
                }`}
            >
              Upload Another
            </button>
          </motion.div>
        )}

        {uploadStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center p-8"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <p className="text-lg font-medium text-red-500">{errorMessage}</p>
            <button
              onClick={() => setUploadStatus('idle')}
              className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium
                ${darkMode 
                  ? 'bg-surface-700 hover:bg-surface-600 text-white' 
                  : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
                }`}
            >
              Try Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUploader;