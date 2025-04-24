import React, { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, ExternalLink, Calendar, DollarSign, MapPin, Filter } from 'lucide-react';
import { JobSearchParams, Job } from '../../types';
import { generateMockJobs } from '../../utils/mockData';
import JobDetailsModal from './JobDetailsModal';

interface JobListingsProps {
  searchParams: JobSearchParams;
  darkMode: boolean;
}

const JobListings: React.FC<JobListingsProps> = ({ searchParams, darkMode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'saved' | 'applied'>('all');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockJobs = generateMockJobs(searchParams, 15);
      setJobs(mockJobs);
      setLoading(false);
    }, 1500);
  }, [searchParams]);

  const toggleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, saved: !job.saved } 
        : job
    ));
  };

  const markAsApplied = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, applied: true } 
        : job
    ));
    setShowModal(false);
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : filter === 'saved' 
      ? jobs.filter(job => job.saved) 
      : jobs.filter(job => job.applied);

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const closeJobDetails = () => {
    setShowModal(false);
  };

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${
      darkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className={`px-6 py-4 border-b ${
        darkMode ? 'border-slate-700' : 'border-gray-200'
      } flex flex-col sm:flex-row justify-between items-start sm:items-center`}>
        <div>
          <h2 className="text-xl font-bold mb-1">Search Results</h2>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {loading ? 'Searching...' : `${filteredJobs.length} jobs found for "${searchParams.role}"`}
          </p>
        </div>
        
        <div className="flex mt-3 sm:mt-0 space-x-2">
          <div className={`inline-flex rounded-lg overflow-hidden ${
            darkMode ? 'bg-slate-700' : 'bg-gray-100'
          }`}>
            {['all', 'saved', 'applied'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option as any)}
                className={`px-3 py-1.5 text-sm font-medium ${
                  filter === option
                    ? darkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-500 text-white'
                    : darkMode
                      ? 'text-gray-300 hover:bg-slate-600' 
                      : 'text-gray-700 hover:bg-gray-200'
                } transition-colors`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          
          <button className={`p-1.5 rounded ${
            darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          } transition-colors`}>
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin mb-4"></div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            Searching for jobs across platforms...
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-8 text-center">
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {filter === 'all' 
              ? 'No jobs found for your search criteria.' 
              : filter === 'saved' 
                ? 'You have no saved jobs.' 
                : 'You have not applied to any jobs yet.'}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className={`mt-4 px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
            >
              View All Jobs
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-slate-700">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors`}
            >
              <div className="flex justify-between">
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div>
                      <button 
                        onClick={() => openJobDetails(job)}
                        className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {job.title}
                      </button>
                      <div className="flex items-center mt-1">
                        <span className={`text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {job.company}
                        </span>
                        {job.applied && (
                          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Applied
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-1.5 rounded-full ${
                        darkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'
                      } transition-colors`}
                      aria-label={job.saved ? 'Unsave job' : 'Save job'}
                    >
                      {job.saved ? (
                        <BookmarkCheck className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Bookmark className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center text-sm space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center">
                      <MapPin className={`w-4 h-4 mr-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {job.location}
                      </span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center">
                        <DollarSign className={`w-4 h-4 mr-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {job.salary}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className={`w-4 h-4 mr-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        Posted {job.postedDate}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className={`line-clamp-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {job.description}
                    </p>
                  </div>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            darkMode 
                              ? 'bg-slate-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  via <span className="font-medium">{job.platform}</span>
                </span>
                
                <div className="flex space-x-3">
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center text-sm ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    } transition-colors`}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Visit Site
                  </a>
                  
                  <button
                    onClick={() => openJobDetails(job)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } transition-colors`}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedJob && showModal && (
        <JobDetailsModal
          job={selectedJob}
          onClose={closeJobDetails}
          onSave={() => toggleSaveJob(selectedJob.id)}
          onApply={() => markAsApplied(selectedJob.id)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default JobListings;