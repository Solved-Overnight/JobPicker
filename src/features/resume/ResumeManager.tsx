import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import ResumeUploader from '../../components/ResumeUploader';
import ResumeAnalyzer from './ResumeAnalyzer';
import { Resume } from '../../types';

interface ResumeManagerProps {
  darkMode: boolean;
}

const ResumeManager: React.FC<ResumeManagerProps> = ({ darkMode }) => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    score: number;
    suggestions: string[];
    keywords: string[];
    missingKeywords: string[];
  } | null>(null);

  const handleResumeUpload = async (file: File) => {
    try {
      // Here we would normally parse the PDF and extract text
      // For demo purposes, we'll simulate the process
      setAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResume: Resume = {
        id: '1',
        name: file.name,
        content: 'Mock resume content',
        skills: ['React', 'TypeScript', 'Node.js'],
        experience: ['Software Engineer at Tech Co'],
        education: ['BS in Computer Science'],
        lastModified: new Date()
      };

      setResume(mockResume);
      await analyzeResume(mockResume);
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeResume = async (resume: Resume) => {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAnalysis({
      score: 75,
      suggestions: [
        'Add more quantifiable achievements',
        'Include relevant certifications',
        'Optimize keywords for ATS systems'
      ],
      keywords: ['React', 'TypeScript', 'Node.js'],
      missingKeywords: ['Docker', 'AWS', 'Python']
    });
  };

  return (
    <div className="space-y-6">
      {!resume ? (
        <ResumeUploader onResumeUpload={handleResumeUpload} darkMode={darkMode} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-xl ${
            darkMode ? 'bg-surface-800' : 'bg-white'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileText className={`w-6 h-6 mr-3 ${
                darkMode ? 'text-primary-400' : 'text-primary-500'
              }`} />
              <div>
                <h3 className="text-xl font-semibold">{resume.name}</h3>
                <p className={`text-sm ${
                  darkMode ? 'text-surface-400' : 'text-surface-500'
                }`}>
                  Last modified: {resume.lastModified.toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setResume(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                darkMode 
                  ? 'bg-surface-700 hover:bg-surface-600' 
                  : 'bg-surface-100 hover:bg-surface-200'
              }`}
            >
              Upload New Resume
            </button>
          </div>

          {analyzing ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary-500" />
              <span className="ml-3 text-lg">Analyzing your resume...</span>
            </div>
          ) : analysis ? (
            <ResumeAnalyzer analysis={analysis} darkMode={darkMode} />
          ) : null}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeManager;