import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { motion } from 'framer-motion';
import { Search, FileText, Settings } from 'lucide-react';
import JobSearchPanel from '../features/jobSearch/JobSearchPanel';
import ResumeManager from '../features/resume/ResumeManager';
import AutomationDashboard from './AutomationDashboard';
import { JobSearchParams, AutomationStats, ApplicationStatus } from '../types';

interface DashboardProps {
  searchParams: JobSearchParams;
  onSearch: (params: JobSearchParams) => void;
  stats: AutomationStats;
  recentApplications: ApplicationStatus[];
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  searchParams,
  onSearch,
  stats,
  recentApplications,
  darkMode
}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Overview', icon: Search },
    { name: 'Resume Manager', icon: FileText },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <div className="flex-grow p-6">
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-2 rounded-xl bg-surface-100 dark:bg-surface-700 p-1 mb-6">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                  ${selected
                    ? 'bg-white dark:bg-surface-800 text-primary-600 dark:text-primary-400 shadow'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-white/[0.12] hover:text-primary-600 dark:hover:text-primary-400'
                  }`
                }
              >
                <motion.div
                  initial={false}
                  animate={{ scale: selectedTab === index ? 1 : 0.9 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </motion.div>
              </Tab>
            );
          })}
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            <div className="space-y-6">
              <AutomationDashboard
                stats={stats}
                recentApplications={recentApplications}
                darkMode={darkMode}
              />
              <JobSearchPanel
                searchParams={searchParams}
                onSearch={onSearch}
                darkMode={darkMode}
              />
            </div>
          </Tab.Panel>

          <Tab.Panel>
            <ResumeManager darkMode={darkMode} />
          </Tab.Panel>

          <Tab.Panel>
            <div className={`p-6 rounded-xl ${
              darkMode ? 'bg-surface-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className="text-xl font-semibold mb-4">Settings</h3>
              {/* Add settings content */}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Dashboard;