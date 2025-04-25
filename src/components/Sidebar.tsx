import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Search, Bookmark, Settings, ChevronRight, X, FileText } from 'lucide-react'; // Removed Briefcase
import { JobSearchParams, SidebarView } from '../types';

interface SidebarProps {
  darkMode: boolean;
  savedSearches: JobSearchParams[];
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (view: SidebarView) => void;
  activeView: SidebarView;
}

const Sidebar: React.FC<SidebarProps> = ({
  darkMode,
  savedSearches,
  isVisible,
  onClose,
  onNavigate,
  activeView
}) => {
  const handleNavigationClick = (view: SidebarView) => {
    onNavigate(view);
    // Close sidebar on mobile after navigation - Handled in App.tsx
  };

  // Simplified helper to determine if a link should appear active
  const isLinkActive = (view: SidebarView) => {
    return activeView === view;
  };

  // Get classes for a navigation link (simplified)
  const getLinkClasses = (view: SidebarView) => {
    const isActive = isLinkActive(view);
    return `flex items-center p-2 rounded-lg transition-colors
      ${isActive
        ? (darkMode ? 'bg-surface-700 text-primary-400' : 'bg-primary-50 text-primary-600') // Active style
        : (darkMode ? 'hover:bg-surface-700 text-white' : 'hover:bg-primary-50 text-surface-900') // Default/hover style
      }`;
  };

  const sidebarContent = (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h2 className="text-lg font-semibold">Navigation</h2>
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${
            darkMode ? 'hover:bg-surface-700' : 'hover:bg-surface-100'
          } transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav>
        <ul className="space-y-2">
          {/* Dashboard Link */}
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigationClick('dashboard'); }}
              className={getLinkClasses('dashboard')}
            >
              <LayoutDashboard className="w-5 h-5 mr-3 text-primary-500" />
              <span>Dashboard</span>
            </a>
          </li>

          {/* Job Search Link */}
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigationClick('job-search'); }}
              className={getLinkClasses('job-search')}
            >
              <Search className="w-5 h-5 mr-3 text-primary-500" />
              <span>Job Search</span>
            </a>
          </li>

          {/* Resume Analyzer Link */}
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigationClick('resume-analyzer'); }}
              className={getLinkClasses('resume-analyzer')}
            >
              <FileText className="w-5 h-5 mr-3 text-primary-500" />
              <span>Resume Analyzer</span>
            </a>
          </li>

          {/* Saved Jobs Link */}
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigationClick('saved-jobs'); }}
              className={getLinkClasses('saved-jobs')}
            >
              <Bookmark className="w-5 h-5 mr-3 text-primary-500" />
              <span>Saved Jobs</span>
            </a>
          </li>

          {/* Settings Link */}
          <li>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavigationClick('settings'); }}
              className={getLinkClasses('settings')}
            >
              <Settings className="w-5 h-5 mr-3 text-primary-500" />
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nav>

      {savedSearches.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-3 text-surface-500">
            Saved Searches
          </h3>
          <ul className="space-y-1">
            {savedSearches.map((search, index) => (
              <li key={index}>
                <a
                  href="#"
                  // TODO: Implement navigation to specific saved search details
                  className={`flex items-center justify-between p-2 text-sm rounded-lg
                    ${darkMode ? 'hover:bg-surface-700' : 'hover:bg-primary-50'}
                    transition-colors`}
                >
                  <span className="truncate">{search.role}</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:block w-64 ${
        darkMode ? 'bg-surface-800 text-white' : 'bg-white text-surface-900'
      } shadow-md flex-shrink-0`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black md:hidden z-20"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
              className={`fixed inset-y-0 left-0 w-64 ${
                darkMode ? 'bg-surface-800 text-white' : 'bg-white text-surface-900'
              } shadow-xl md:hidden z-30`}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
