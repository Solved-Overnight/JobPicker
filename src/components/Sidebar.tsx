import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Briefcase, Settings, ChevronRight, X } from 'lucide-react';
import { JobSearchParams } from '../types';

interface SidebarProps {
  darkMode: boolean;
  savedSearches: JobSearchParams[];
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  darkMode, 
  savedSearches,
  isVisible,
  onClose
}) => {
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
          <li>
            <a 
              href="#" 
              className={`flex items-center p-2 rounded-lg 
                ${darkMode 
                  ? 'hover:bg-surface-700 text-white' 
                  : 'hover:bg-primary-50 text-surface-900'} 
                transition-colors`}
            >
              <Briefcase className="w-5 h-5 mr-3 text-primary-500" />
              <span>Job Search</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`flex items-center p-2 rounded-lg 
                ${darkMode 
                  ? 'hover:bg-surface-700 text-white' 
                  : 'hover:bg-primary-50 text-surface-900'} 
                transition-colors`}
            >
              <Bookmark className="w-5 h-5 mr-3 text-primary-500" />
              <span>Saved Jobs</span>
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`flex items-center p-2 rounded-lg 
                ${darkMode 
                  ? 'hover:bg-surface-700 text-white' 
                  : 'hover:bg-primary-50 text-surface-900'} 
                transition-colors`}
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
      } shadow-md`}>
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