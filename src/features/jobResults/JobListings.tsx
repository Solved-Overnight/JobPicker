import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ExternalLink, Bookmark, Loader2, AlertTriangle, Search } from 'lucide-react';
import { JobListing, JobSearchParams, JobPlatform } from '../../types';
import JobDetailsModal from './JobDetailsModal';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { scrapeIndeed as scrapeIndeedProxy } from '../../api/indeed';

interface JobListingsProps {
  searchParams: JobSearchParams;
  darkMode: boolean;
  jobSearchApiKey?: string;
}

const JobListings: React.FC<JobListingsProps> = ({ searchParams, darkMode, jobSearchApiKey }) => {
  const [listings, setListings] = useState<JobListing[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      if (!searchParams.role) {
        setListings([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setListings([]);
      setCurrentPage(1);

      try {
        const html = await scrapeIndeedProxy(searchParams.role, searchParams.location);
        const indeedListings = parseIndeedJobListings(html);
        setListings(indeedListings);
      } catch (err: any) {
        console.error("Failed to fetch job listings:", err);
        setError(err.message || "An unknown error occurred while fetching jobs.");
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams, jobSearchApiKey]);

  const parseIndeedJobListings = (html: string): JobListing[] => {
    const $ = cheerio.load(html);

    if (!$) {
      throw new Error('Failed to load HTML with Cheerio');
    }

    const jobListings: JobListing[] = [];

    $('.job_seen_beacon').each((i, el) => {
      const jobTitle = $(el).find('h2.jobTitle a').text().trim();
      const company = $(el).find('.companyName').text().trim();
      const location = $(el).find('.companyLocation').text().trim();
      const jobUrl = 'https://www.indeed.com' + $(el).find('h2.jobTitle a').attr('href');
      const jobId = jobUrl.split('&')[0].split('jk=')[1];

      jobListings.push({
        id: jobId,
        title: jobTitle,
        company: company,
        location: location,
        platform: 'Indeed',
        url: jobUrl,
      });
    });

    return jobListings;
  };

  const scrapeIndeed = async (role: string, location: string | undefined): Promise<JobListing[]> => {
    const baseUrl = 'https://www.indeed.com/jobs';
    const searchParams = new URLSearchParams({
      q: role,
      l: location || '',
    });
    const url = `${baseUrl}?${searchParams.toString()}`;

    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      if (!$) {
        throw new Error('Failed to load HTML with Cheerio');
      }

      const jobListings: JobListing[] = [];

      $('.job_seen_beacon').each((i, el) => {
        const jobTitle = $(el).find('h2.jobTitle a').text().trim();
        const company = $(el).find('.companyName').text().trim();
        const location = $(el).find('.companyLocation').text().trim();
        const jobUrl = 'https://www.indeed.com' + $(el).find('h2.jobTitle a').attr('href');
        const jobId = jobUrl.split('&')[0].split('jk=')[1];

        jobListings.push({
          id: jobId,
          title: jobTitle,
          company: company,
          location: location,
          platform: 'Indeed',
          url: jobUrl,
        });
      });

      return jobListings;
    } catch (error: any) {
      console.error('Error scraping Indeed:', error);
      throw new Error(`Failed to scrape Indeed: ${error.message}`);
    }
  };

  const handleViewDetails = (job: JobListing) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleSaveJob = (jobId: string) => {
    console.log("Saving job:", jobId);
    setListings(listings.map(job =>
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = listings.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(listings.length / jobsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`mt-6 rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-surface-800' : 'bg-white'
        }`}
    >
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-surface-700' : 'border-gray-200'
        }`}>
        <h2 className="text-xl font-bold flex items-center">
          <Search className="w-5 h-5 mr-2 text-primary-500" />
          Job Listings for "{searchParams.role}" {searchParams.location && `in "${searchParams.location}"`}
        </h2>
      </div>

      <div className="p-6">
        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className={`w-8 h-8 animate-spin ${darkMode ? 'text-primary-400' : 'text-primary-500'}`} />
            <span className="ml-3 text-lg">Searching for jobs...</span>
          </div>
        )}

        {error && (
          <div className={`p-4 rounded-md flex items-center ${darkMode ? 'bg-red-900 bg-opacity-40 text-red-300' : 'bg-red-100 text-red-700'}`}>
            <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Error fetching jobs:</p>
              <p className="text-sm">{error}</p>
              {!jobSearchApiKey && <p className="text-sm mt-1">Please add a Job Search API key in the settings.</p>}
            </div>
          </div>
        )}

        {!isLoading && !error && listings.length === 0 && searchParams.role && (
          <div className="text-center py-10">
            <Search className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-surface-500' : 'text-surface-400'}`} />
            <p className={`text-lg font-medium ${darkMode ? 'text-surface-300' : 'text-surface-600'}`}>No jobs found matching your criteria.</p>
            <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>Try broadening your search terms.</p>
          </div>
        )}

        {!isLoading && !error && listings.length > 0 && (
          <>
            <div className="space-y-4">
              {currentJobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg border ${darkMode
                      ? 'bg-surface-750 border-surface-700 hover:bg-surface-700'
                      : 'bg-surface-50 border-surface-200 hover:bg-surface-100'
                    } transition-colors shadow-sm`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>{job.title}</h3>
                      <p className="text-sm font-medium">{job.company}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                       {/* Save Job Button */}
                       <button
                         onClick={() => handleSaveJob(job.id)}
                         className={`p-1.5 rounded-full transition-colors ${
                           job.isSaved
                             ? (darkMode ? 'bg-yellow-600 text-white hover:bg-yellow-700' : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500')
                             : (darkMode ? 'text-surface-400 hover:bg-surface-600 hover:text-yellow-400' : 'text-surface-500 hover:bg-surface-200 hover:text-yellow-500')
                         }`}
                         aria-label={job.isSaved ? "Unsave job" : "Save job"}
                         title={job.isSaved ? "Unsave job" : "Save job"}
                       >
                         <Bookmark className={`w-4 h-4 ${job.isSaved ? 'fill-current' : ''}`} />
                       </button>
                      {/* External Link Button */}
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-full transition-colors ${darkMode ? 'text-surface-400 hover:bg-surface-600 hover:text-primary-400' : 'text-surface-500 hover:bg-surface-200 hover:text-primary-500'}`}
                        aria-label="View original job post"
                        title="View original job post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center text-xs space-x-4 mt-2 text-surface-500 dark:text-surface-400">
                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</span>
                    <span className="flex items-center"><Briefcase className="w-3 h-3 mr-1" /> {job.platform}</span>
                    {job.postedDate && <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {job.postedDate}</span>}
                  </div>
                  {job.matchScore && (
                    <div className="mt-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${darkMode ? 'bg-green-800 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        Match Score: {job.matchScore}%
                      </span>
                    </div>
                  )}
                  {job.summary && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {job.summary}
                    </p>
                  )}
                  <button
                    onClick={() => handleViewDetails(job)}
                    className={`mt-3 text-sm font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                      } transition-colors`}
                  >
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-surface-700 hover:bg-surface-600 disabled:opacity-50' : 'bg-surface-200 hover:bg-surface-300 disabled:opacity-50'}`}
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-surface-700 hover:bg-surface-600 disabled:opacity-50' : 'bg-surface-200 hover:bg-surface-300 disabled:opacity-50'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={handleCloseModal}
          darkMode={darkMode}
          onSaveToggle={handleSaveJob}
        />
      )}
    </motion.div>
  );
};

export default JobListings;
