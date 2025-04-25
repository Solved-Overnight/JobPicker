import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Trash2, Eye, Edit2, AlertTriangle } from 'lucide-react'; // Added icons
import ResumeUploader from '../../components/ResumeUploader'; // Assuming this exists
import ResumeAnalyzer from './ResumeAnalyzer'; // Assuming this exists

interface ResumeManagerProps {
  darkMode: boolean;
}

// Mock resume data structure
interface ResumeFile {
  id: string;
  name: string;
  uploadDate: string;
  size: string; // e.g., "1.2 MB"
  // Add other relevant fields like file type, analysis status, etc.
}

const ResumeManager: React.FC<ResumeManagerProps> = ({ darkMode }) => {
  // Mock state for uploaded resumes - replace with actual state management/API calls
  const [resumes, setResumes] = useState<ResumeFile[]>([
    { id: '1', name: 'Frontend_Dev_Resume_v3.pdf', uploadDate: '2024-02-15', size: '850 KB' },
    { id: '2', name: 'Software_Engineer_General.docx', uploadDate: '2024-02-10', size: '1.1 MB' },
  ]);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedResumeForAnalysis, setSelectedResumeForAnalysis] = useState<ResumeFile | null>(null);

  const handleUploadSuccess = (/* uploadedFile: File */) => {
    // TODO: Add the actual uploaded file details to the resumes state
    console.log("Upload successful - update resume list");
    // Example: Add a new mock entry
    setResumes(prev => [...prev, {
      id: Date.now().toString(),
      name: `New_Resume_${Date.now()}.pdf`,
      uploadDate: new Date().toISOString().split('T')[0],
      size: '900 KB'
    }]);
    setShowUploader(false); // Hide uploader after success
  };

  const handleDeleteResume = (resumeId: string) => {
    // TODO: Implement actual deletion logic (API call, state update)
    console.log("Deleting resume:", resumeId);
    setResumes(prev => prev.filter(r => r.id !== resumeId));
  };

  const handleAnalyzeResume = (resume: ResumeFile) => {
    console.log("Analyzing resume:", resume.name);
    setSelectedResumeForAnalysis(resume);
    // Optionally scroll to the analyzer section if it's far away
    document.getElementById('resume-analyzer-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-surface-800' : 'bg-white'
        }`}
    >
      <div className={`px-6 py-4 border-b ${darkMode
          ? 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 border-surface-700' // Example gradient
          : 'bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-500 border-gray-200' // Example gradient
        } animate-gradient-x flex justify-between items-center`}>
        <h2 className="text-xl font-bold flex items-center text-white">
          <FileText className="w-5 h-5 mr-2" />
          Resume Manager
        </h2>
        <button
          onClick={() => setShowUploader(!showUploader)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors ${darkMode
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-white hover:bg-indigo-50 text-indigo-600'
            }`}
        >
          <UploadCloud className="w-4 h-4 mr-1" />
          {showUploader ? 'Cancel Upload' : 'Upload New Resume'}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Uploader Section (Conditional) */}
        {showUploader && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <ResumeUploader
              onUploadSuccess={handleUploadSuccess}
              darkMode={darkMode}
            />
            <hr className={`my-4 ${darkMode ? 'border-surface-700' : 'border-gray-200'}`} />
          </motion.div>
        )}

        {/* Resume List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Your Resumes</h3>
          {resumes.length > 0 ? (
            <ul className={`border rounded-lg overflow-hidden ${darkMode ? 'border-surface-700 divide-surface-700' : 'border-gray-200 divide-gray-200'} divide-y`}>
              {resumes.map((resume) => (
                <li
                  key={resume.id}
                  className={`px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center ${darkMode ? 'hover:bg-surface-750' : 'hover:bg-gray-50'} transition-colors`}
                >
                  <div className="mb-2 md:mb-0">
                    <p className="font-medium flex items-center">
                      <FileText className={`w-4 h-4 mr-2 flex-shrink-0 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                      {resume.name}
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
                      Uploaded: {resume.uploadDate} | Size: {resume.size}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => handleAnalyzeResume(resume)}
                      className={`p-1.5 rounded-md text-xs font-medium flex items-center transition-colors ${darkMode
                          ? 'bg-primary-600 hover:bg-primary-700 text-white'
                          : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
                        }`}
                      title="Analyze Resume"
                    >
                      <Eye className="w-3 h-3 mr-1" /> Analyze
                    </button>
                    <button
                      // onClick={() => console.log("Edit resume:", resume.id)} // Placeholder
                      className={`p-1.5 rounded-md transition-colors ${darkMode ? 'text-surface-400 hover:bg-surface-700 hover:text-white' : 'text-surface-500 hover:bg-surface-200 hover:text-surface-700'}`}
                      title="Edit (Placeholder)"
                      disabled // Disable edit for now
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className={`p-1.5 rounded-md transition-colors ${darkMode ? 'text-red-400 hover:bg-red-900 hover:bg-opacity-30' : 'text-red-500 hover:bg-red-100'}`}
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className={`text-center p-6 border border-dashed rounded-lg ${darkMode ? 'border-surface-700 text-surface-500' : 'border-gray-300 text-gray-500'}`}>
              <FileText className="w-10 h-10 mx-auto mb-2" />
              <p>No resumes uploaded yet.</p>
              <button
                onClick={() => setShowUploader(true)}
                className={`mt-2 text-sm font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
              >
                Upload your first resume
              </button>
            </div>
          )}
        </div>

        {/* Resume Analyzer Section (Conditional) */}
        {selectedResumeForAnalysis && (
          <motion.div
            id="resume-analyzer-section" // ID for scrolling
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-6 border-t border-dashed border-surface-300 dark:border-surface-700"
          >
            <ResumeAnalyzer
              resumeFile={selectedResumeForAnalysis} // Pass the selected resume file info
              darkMode={darkMode}
              // Pass any necessary API keys or config from userPreferences if needed
            />
          </motion.div>
        )}

         {/* Placeholder for future features */}
         {/* <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-surface-750 border border-surface-700' : 'bg-surface-50 border border-surface-200'}`}>
           <h4 className="font-semibold mb-2">Coming Soon</h4>
           <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
             Automated resume tailoring suggestions based on job descriptions.
           </p>
         </div> */}
      </div>
    </motion.div>
  );
};

// Dummy ResumeUploader component (replace with actual implementation)
const ResumeUploaderPlaceholder: React.FC<{ onUploadSuccess: (file: File) => void, darkMode: boolean }> = ({ onUploadSuccess, darkMode }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setError(null);
      // Simulate upload
      setTimeout(() => {
        // Simulate success/error
        if (file.name.includes("fail")) {
           setError("Simulated upload failure.");
           setIsUploading(false);
        } else {
           console.log("Simulating upload for:", file.name);
           // onUploadSuccess(file); // Pass the actual file in real implementation
           onUploadSuccess({} as File); // Pass dummy file for now
           setIsUploading(false);
        }
      }, 1500);
    }
  };

  return (
    <div className={`p-4 border border-dashed rounded-lg ${darkMode ? 'border-surface-600 bg-surface-750' : 'border-gray-300 bg-gray-50'}`}>
      <input
        type="file"
        id="resume-upload-input"
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt" // Specify accepted file types
        disabled={isUploading}
      />
      <label
        htmlFor="resume-upload-input"
        className={`cursor-pointer flex flex-col items-center justify-center p-6 rounded-lg ${darkMode ? 'hover:bg-surface-700' : 'hover:bg-gray-100'} transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <UploadCloud className={`w-10 h-10 mb-3 ${darkMode ? 'text-surface-400' : 'text-gray-500'}`} />
        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
          {isUploading ? 'Uploading...' : 'Click or drag file to upload'}
        </span>
        <span className={`text-xs mt-1 ${darkMode ? 'text-surface-400' : 'text-gray-500'}`}>
          PDF, DOC, DOCX, TXT (Max 5MB)
        </span>
      </label>
      {isUploading && <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-3"><div className="bg-blue-600 h-1.5 rounded-full animate-pulse"></div></div>}
      {error && <p className="text-xs text-red-500 mt-2 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/>{error}</p>}
    </div>
  );
};

// Dummy ResumeAnalyzer component (replace with actual implementation)
const ResumeAnalyzerPlaceholder: React.FC<{ resumeFile: ResumeFile, darkMode: boolean }> = ({ resumeFile, darkMode }) => {
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    // Simulate analysis API call
    setTimeout(() => {
      if (resumeFile.name.includes("error")) {
        setError("Simulated analysis error.");
      } else {
        setAnalysisResult(`Analysis complete for ${resumeFile.name}. Found 5 keywords, 2 action verbs need improvement. Overall score: 85%.`);
      }
      setIsLoading(false);
    }, 2000);
  }, [resumeFile]); // Re-analyze when the selected resume changes

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Resume Analysis</h3>
      <p className={`text-sm mb-3 ${darkMode ? 'text-surface-300' : 'text-surface-700'}`}>
        Analyzing: <span className="font-medium">{resumeFile.name}</span>
      </p>
      {isLoading && (
        <div className="flex items-center space-x-2 p-4 rounded-md bg-opacity-50 bg-primary-500 text-white">
           <Loader2 className="w-5 h-5 animate-spin" />
           <span>Analyzing resume content...</span>
        </div>
      )}
      {error && (
         <div className={`p-3 rounded-md text-sm flex items-center ${darkMode ? 'bg-red-900 bg-opacity-50 text-red-300' : 'bg-red-100 text-red-700'}`}>
            <AlertTriangle className="w-4 h-4 mr-2"/> {error}
         </div>
      )}
      {analysisResult && !isLoading && (
        <div className={`p-4 rounded-md ${darkMode ? 'bg-surface-700' : 'bg-green-50'}`}>
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-green-800'}`}>{analysisResult}</p>
          {/* TODO: Display more detailed analysis results */}
        </div>
      )}
    </div>
  );
};

// Use placeholders until actual components are implemented
// export default ResumeManager;
export default function ResumeManagerWrapper(props: ResumeManagerProps) {
  // Replace placeholders with actual components when ready
  const ActualResumeUploader = ResumeUploaderPlaceholder;
  const ActualResumeAnalyzer = ResumeAnalyzerPlaceholder;

  return <ResumeManager {...props} />;
}
