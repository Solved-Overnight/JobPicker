import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, XCircle, Loader2, AlertTriangle } from 'lucide-react'; // Added icons

interface ResumeUploaderProps {
  onUploadSuccess: (file: File) => void; // Callback with the uploaded file
  darkMode: boolean;
  maxSize?: number; // Max size in bytes (e.g., 5 * 1024 * 1024 for 5MB)
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onUploadSuccess,
  darkMode,
  maxSize = 5 * 1024 * 1024 // Default 5MB
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // Basic progress simulation

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setUploadError(null);
    setUploadedFile(null);
    setProgress(0);

    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-too-large') {
        setUploadError(`File is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
      } else if (error.code === 'file-invalid-type') {
        setUploadError('Invalid file type. Please upload PDF, DOC, DOCX, or TXT.');
      } else {
        setUploadError(error.message || 'File rejected.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      // Start simulated upload process
      setIsUploading(true);
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        if (currentProgress >= 100) {
          clearInterval(interval);
          // Simulate success/failure based on filename (for demo)
          if (file.name.toLowerCase().includes("fail")) {
             setUploadError("Simulated upload failure. Please try again.");
             setIsUploading(false);
             setUploadedFile(null); // Clear file on failure
             setProgress(0);
          } else {
             console.log('Simulated upload success:', file.name);
             onUploadSuccess(file);
             setIsUploading(false);
             // Keep uploadedFile state to show preview, or clear it if parent handles display
             // setUploadedFile(null);
             // setProgress(0);
          }
        }
      }, 150); // Simulate progress update speed
    }
  }, [onUploadSuccess, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: maxSize,
    multiple: false, // Allow only single file upload
    disabled: isUploading, // Disable dropzone while uploading
  });

  const removeFile = () => {
    setUploadedFile(null);
    setUploadError(null);
    setIsUploading(false);
    setProgress(0);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className={`p-4 border border-dashed rounded-lg ${darkMode ? 'border-surface-600 bg-surface-750' : 'border-gray-300 bg-gray-50'}`}>
      {!uploadedFile && !isUploading && (
        <div
          {...getRootProps()}
          className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-lg transition-colors
            ${isDragActive
              ? (darkMode ? 'bg-primary-900 bg-opacity-30 border-primary-500' : 'bg-primary-50 border-primary-300')
              : (darkMode ? 'hover:bg-surface-700' : 'hover:bg-gray-100')
            }
            ${uploadError ? (darkMode ? 'border-red-500' : 'border-red-400') : ''}
          `}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-10 h-10 mb-3 ${darkMode ? 'text-surface-400' : 'text-gray-500'}`} />
          <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            {isDragActive ? 'Drop the file here...' : 'Click or drag resume file to upload'}
          </span>
          <span className={`text-xs mt-1 ${darkMode ? 'text-surface-400' : 'text-gray-500'}`}>
            PDF, DOC, DOCX, TXT (Max {maxSize / 1024 / 1024}MB)
          </span>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-500 mt-2 flex items-center">
          <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" /> {uploadError}
        </p>
      )}

      {(uploadedFile || isUploading) && !uploadError && (
        <div className={`p-3 rounded-md border ${darkMode ? 'bg-surface-700 border-surface-600' : 'bg-white border-gray-300'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 overflow-hidden">
              <FileText className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              <span className="text-sm font-medium truncate" title={uploadedFile?.name}>
                {uploadedFile?.name || 'Uploading...'}
              </span>
              {uploadedFile && <span className="text-xs text-gray-500 flex-shrink-0">({formatBytes(uploadedFile.size)})</span>}
            </div>
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-primary-500 animate-spin flex-shrink-0" />
            ) : (
              <button onClick={removeFile} className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-surface-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
          {isUploading && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
              <div
                className="bg-primary-600 h-1.5 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
