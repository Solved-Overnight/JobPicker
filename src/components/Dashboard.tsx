import React from 'react';
import { motion } from 'framer-motion';
import JobSearchPanel from '../features/jobSearch/JobSearchPanel';
import AutomationDashboard from './AutomationDashboard'; // Assuming this exists
import ResumeManager from '../features/resume/ResumeManager'; // Assuming this exists
import { JobSearchParams, AutomationStats, ApplicationStatus, SidebarView } from '../types';

interface DashboardProps {
  searchParams: JobSearchParams;
  onSearch: (params: JobSearchParams) => void;
  stats: AutomationStats;
  recentApplications: ApplicationStatus[];
  darkMode: boolean;
  activeView: SidebarView; // Receive active view
  onViewChange: (view: SidebarView) => void; // To potentially switch tabs internally if needed
}

const Dashboard: React.FC<DashboardProps> = ({
  searchParams,
  onSearch,
  stats,
  recentApplications,
  darkMode,
  activeView, // Use activeView to determine which section might be focused/relevant
  // onViewChange // Can be used for internal tab-like behavior if needed later
}) => {

  // Variants for animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-8"> {/* Add spacing between sections */}

      {/* Automation Dashboard Section */}
      <motion.section
        id="automation-dashboard-section" // Ensure this ID matches the scroll target
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <AutomationDashboard
          stats={stats}
          recentApplications={recentApplications}
          darkMode={darkMode}
        />
      </motion.section>

      {/* Job Search Section */}
      <motion.section
        id="job-search-section" // Ensure this ID matches the scroll target
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <JobSearchPanel
          searchParams={searchParams}
          onSearch={onSearch}
          darkMode={darkMode}
        />
      </motion.section>

      {/* Resume Manager Section */}
      <motion.section
        id="resume-manager-section" // Add ID for potential scrolling
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Render ResumeManager - Assuming it's a self-contained component */}
        {/* You might pass darkMode or other relevant props */}
        <ResumeManager darkMode={darkMode} />
      </motion.section>

      {/* Add other dashboard sections/components here as needed */}

    </div>
  );
};

export default Dashboard;
