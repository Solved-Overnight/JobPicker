import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ResumeAnalyzerProps {
  analysis: {
    score: number;
    suggestions: string[];
    keywords: string[];
    missingKeywords: string[];
  };
  darkMode: boolean;
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ analysis, darkMode }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-lg ${
            darkMode ? 'bg-surface-700' : 'bg-surface-50'
          }`}
        >
          <h4 className="text-lg font-medium mb-4">ATS Score</h4>
          <div className="flex items-center justify-center">
            <div className="w-32 h-32">
              <CircularProgressbar
                value={analysis.score}
                text={`${analysis.score}%`}
                styles={buildStyles({
                  pathColor: analysis.score > 80 
                    ? '#22c55e' 
                    : analysis.score > 60 
                    ? '#0ea5e9' 
                    : '#ef4444',
                  textColor: darkMode ? '#e2e8f0' : '#1e293b',
                  trailColor: darkMode ? '#1e293b' : '#f1f5f9'
                })}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-lg ${
            darkMode ? 'bg-surface-700' : 'bg-surface-50'
          }`}
        >
          <h4 className="text-lg font-medium mb-4">Detected Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                  darkMode 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-green-100 text-green-800'
                }`}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-lg ${
            darkMode ? 'bg-surface-700' : 'bg-surface-50'
          }`}
        >
          <h4 className="text-lg font-medium mb-4">Missing Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
                  darkMode 
                    ? 'bg-red-900/30 text-red-400' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <XCircle className="w-3 h-3 mr-1" />
                {keyword}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-lg ${
          darkMode ? 'bg-surface-700' : 'bg-surface-50'
        }`}
      >
        <h4 className="text-lg font-medium mb-4">Suggestions for Improvement</h4>
        <div className="space-y-3">
          {analysis.suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-start"
            >
              <AlertTriangle className={`w-5 h-5 mr-2 flex-shrink-0 ${
                darkMode ? 'text-primary-400' : 'text-primary-500'
              }`} />
              <p className={darkMode ? 'text-surface-300' : 'text-surface-600'}>
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeAnalyzer;