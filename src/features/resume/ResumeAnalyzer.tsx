import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, CheckCircle, FileText, BarChart2 } from 'lucide-react'; // Added icons

// Mock resume data structure (ensure it matches the one in ResumeManager)
interface ResumeFile {
  id: string;
  name: string;
  // Add other relevant fields if needed by the analyzer
}

interface ResumeAnalyzerProps {
  resumeFile: ResumeFile | null; // Can be null if no resume is selected
  darkMode: boolean;
  // Pass API keys or other config if needed for the actual analysis API
  // aiApiKey?: string;
}

// Mock analysis result structure (adjust based on actual API)
interface AnalysisResult {
  overallScore: number;
  keywordMatch: {
    found: string[];
    missing: string[]; // Example: keywords from a target job description
  };
  actionVerbs: {
    strong: string[];
    weak: string[];
  };
  suggestions: string[];
  summary: string;
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ resumeFile, darkMode }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeFile) {
      // Clear results if no resume is selected
      setAnalysisResult(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const performAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);
      console.log(`Starting analysis for: ${resumeFile.name}`);

      // --- START: Replace with actual API call ---
      try {
        // ** TODO: Replace this setTimeout with your actual analysis API fetch logic **
        // Example structure:
        // const apiUrl = `https://your-analysis-api.com/analyze`;
        // const response = await fetch(apiUrl, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${aiApiKey}`, // Use appropriate key
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ resumeId: resumeFile.id }) // Or send file content
        // });
        // if (!response.ok) {
        //   throw new Error(`API Error: ${response.statusText}`);
        // }
        // const data: AnalysisResult = await response.json();
        // setAnalysisResult(data);

        // Simulate API call delay and potential errors
        await new Promise(resolve => setTimeout(resolve, 2500));

        if (resumeFile.name.toLowerCase().includes("error")) {
          throw new Error("Simulated analysis API error.");
        } else {
          // Simulate successful analysis with mock data
          const mockResult: AnalysisResult = {
            overallScore: Math.floor(Math.random() * 30) + 70, // Random score 70-99
            keywordMatch: {
              found: ['React', 'TypeScript', 'Node.js', 'Agile', 'CI/CD'],
              missing: ['GraphQL', 'AWS', 'Testing'],
            },
            actionVerbs: {
              strong: ['Developed', 'Led', 'Implemented', 'Managed', 'Optimized'],
              weak: ['Assisted', 'Helped', 'Worked on'],
            },
            suggestions: [
              'Quantify achievements where possible (e.g., "Increased performance by 15%").',
              'Consider adding keywords relevant to cloud technologies (AWS, Azure, GCP).',
              'Replace weaker action verbs like "Assisted" with stronger alternatives.',
            ],
            summary: `Solid resume for a ${resumeFile.name.includes("Frontend") ? "Frontend" : "Software"} role. Strong skills in core web technologies. Could be improved by quantifying impact and adding more keywords related to testing and cloud platforms.`,
          };
          setAnalysisResult(mockResult);
        }

      } catch (err: any) {
        console.error("Failed to analyze resume:", err);
        setError(err.message || "An unknown error occurred during analysis.");
        setAnalysisResult(null);
      } finally {
        setIsLoading(false);
      }
      // --- END: Replace with actual API call ---
    };

    performAnalysis();
  }, [resumeFile]); // Re-run analysis when the selected resume changes

  if (!resumeFile && !isLoading) {
    return (
      <div className={`p-6 text-center border border-dashed rounded-lg ${darkMode ? 'border-surface-700 text-surface-500' : 'border-gray-300 text-gray-500'}`}>
        <BarChart2 className="w-10 h-10 mx-auto mb-2" />
        Select a resume from the list above to start the analysis.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 rounded-lg ${darkMode ? 'bg-surface-750' : 'bg-surface-50'} border ${darkMode ? 'border-surface-700' : 'border-surface-200'}`}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <BarChart2 className={`w-5 h-5 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
        Analysis Results for: <span className="ml-1 font-medium truncate">{resumeFile?.name}</span>
      </h3>

      {isLoading && (
        <div className="flex justify-center items-center py-10 space-x-3">
          <Loader2 className={`w-6 h-6 animate-spin ${darkMode ? 'text-primary-400' : 'text-primary-500'}`} />
          <span className="text-md">Analyzing resume content, please wait...</span>
        </div>
      )}

      {error && (
        <div className={`p-4 rounded-md flex items-center ${darkMode ? 'bg-red-900 bg-opacity-40 text-red-300' : 'bg-red-100 text-red-700'}`}>
          <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium">Analysis Failed:</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {analysisResult && !isLoading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Overall Score */}
          <div className="text-center">
             <p className="text-sm uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1">Overall Match Score</p>
             <p className={`text-4xl font-bold ${analysisResult.overallScore > 85 ? 'text-green-500' : analysisResult.overallScore > 70 ? 'text-yellow-500' : 'text-red-500'}`}>
               {analysisResult.overallScore}%
             </p>
          </div>

          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-2">Summary:</h4>
            <p className={`text-sm p-3 rounded-md ${darkMode ? 'bg-surface-700' : 'bg-white border border-surface-200'}`}>
              {analysisResult.summary}
            </p>
          </div>

          {/* Keyword Analysis */}
          <div>
            <h4 className="font-semibold mb-2">Keyword Match:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-3 rounded-md ${darkMode ? 'bg-green-900 bg-opacity-30' : 'bg-green-50 border border-green-200'}`}>
                <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Keywords Found:</p>
                <ul className="list-disc list-inside text-xs">
                  {analysisResult.keywordMatch.found.map((kw, i) => <li key={i}>{kw}</li>)}
                </ul>
              </div>
              <div className={`p-3 rounded-md ${darkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>Potential Missing Keywords:</p>
                <ul className="list-disc list-inside text-xs">
                  {analysisResult.keywordMatch.missing.map((kw, i) => <li key={i}>{kw}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Verbs */}
          <div>
            <h4 className="font-semibold mb-2">Action Verbs:</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className={`p-3 rounded-md ${darkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50 border border-blue-200'}`}>
                 <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Strong Verbs Used:</p>
                 <p className="text-xs">{analysisResult.actionVerbs.strong.join(', ')}</p>
               </div>
               <div className={`p-3 rounded-md ${darkMode ? 'bg-orange-900 bg-opacity-30' : 'bg-orange-50 border border-orange-200'}`}>
                 <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Weaker Verbs (Consider Replacing):</p>
                 <p className="text-xs">{analysisResult.actionVerbs.weak.join(', ')}</p>
               </div>
             </div>
          </div>

          {/* Suggestions */}
          <div>
            <h4 className="font-semibold mb-2">Suggestions for Improvement:</h4>
            <ul className={`list-disc list-inside space-y-1 text-sm p-3 rounded-md ${darkMode ? 'bg-surface-700' : 'bg-white border border-surface-200'}`}>
              {analysisResult.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResumeAnalyzer;
