import React from 'react';
import { X, MapPin, DollarSign, Calendar, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Job } from '../../types';

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onSave: () => void;
  onApply: () => void;
  darkMode: boolean;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onSave,
  onApply,
  darkMode
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`w-full max-w-4xl rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col
          ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
      >
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center sticky top-0 ${darkMode ? 'bg-slate-800' : 'bg-white'} z-10`}>
          <div>
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-base">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full p-1 
              ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}
              transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3">About the Job</h4>
                <p className={`whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {job.description}
                </p>
              </div>
              
              {job.skills && job.skills.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          darkMode 
                            ? 'bg-slate-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-3">About the Company</h4>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {job.company} is a leading company in the tech industry, focused on innovation and excellence.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className={`p-4 rounded-lg mb-6 ${
                darkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <h4 className="font-medium mb-3">Job Details</h4>
                <ul className="space-y-3">
                  <li className="flex">
                    <MapPin className={`w-5 h-5 mr-2 flex-shrink-0 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {job.location}
                    </span>
                  </li>
                  {job.salary && (
                    <li className="flex">
                      <DollarSign className={`w-5 h-5 mr-2 flex-shrink-0 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {job.salary}
                      </span>
                    </li>
                  )}
                  <li className="flex">
                    <Calendar className={`w-5 h-5 mr-2 flex-shrink-0 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Posted {job.postedDate}
                    </span>
                  </li>
                </ul>
              </div>
              
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <h4 className="font-medium mb-3">Source</h4>
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  This job was found on <span className="font-medium">{job.platform}</span>
                </p>
                
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center text-sm mb-4 ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  } transition-colors`}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Original Posting
                </a>
                
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  AI Job Hunter does not directly handle job applications. You will be redirected to the original job posting to complete the application.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`px-6 py-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center mt-auto`}>
          <button
            onClick={onSave}
            className={`flex items-center px-4 py-2 rounded-lg ${
              job.saved
                ? darkMode 
                  ? 'bg-blue-900 bg-opacity-30 text-blue-400' 
                  : 'bg-blue-50 text-blue-700'
                : darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } transition-colors`}
          >
            {job.saved ? (
              <>
                <BookmarkCheck className="w-5 h-5 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="w-5 h-5 mr-2" />
                Save Job
              </>
            )}
          </button>
          
          <div className="flex space-x-3">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'border-blue-600 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30' 
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'
              } transition-colors`}
            >
              Apply on {job.platform}
            </a>
            
            <button
              onClick={onApply}
              className={`px-4 py-2 rounded-lg font-medium ${
                job.applied
                  ? darkMode 
                    ? 'bg-green-800 text-white cursor-default' 
                    : 'bg-green-100 text-green-800 cursor-default'
                  : darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
              disabled={job.applied}
            >
              {job.applied ? 'Applied' : 'Mark as Applied'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;