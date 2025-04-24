import React from 'react';
import { motion } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { BarChart, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AutomationStats, ApplicationStatus } from '../types';

interface AutomationDashboardProps {
  stats: AutomationStats;
  recentApplications: ApplicationStatus[];
  darkMode: boolean;
}

const AutomationDashboard: React.FC<AutomationDashboardProps> = ({
  stats,
  recentApplications,
  darkMode
}) => {
  const successRate = (stats.successfulApplications / stats.totalApplications) * 100 || 0;

  return (
    <div className={`p-6 rounded-xl ${darkMode ? 'bg-surface-800' : 'bg-white'} shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Automation Dashboard</h3>
        <Activity className={`w-6 h-6 ${darkMode ? 'text-primary-400' : 'text-primary-500'}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg ${
            darkMode ? 'bg-surface-700' : 'bg-surface-50'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
                Success Rate
              </p>
              <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12">
              <CircularProgressbar
                value={successRate}
                styles={buildStyles({
                  pathColor: darkMode ? '#38bdf8' : '#0ea5e9',
                  trailColor: darkMode ? '#1e293b' : '#f1f5f9',
                })}
              />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
            <span>{stats.successfulApplications} successful</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg ${
            darkMode ? 'bg-surface-700' : 'bg-surface-50'
          }`}
        >
          <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            Total Applications
          </p>
          <p className="text-2xl font-bold mb-4">{stats.totalApplications}</p>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-primary-500 mr-1" />
            <span>Last 30 days</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-4 rounded-lg ${
            darkMode ? 'bg-surface-700' : 'bg-surface-50'
          }`}
        >
          <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            Average Match Score
          </p>
          <p className="text-2xl font-bold mb-4">{stats.averageMatchScore.toFixed(1)}%</p>
          <div className="flex items-center text-sm">
            <BarChart className="w-4 h-4 text-primary-500 mr-1" />
            <span>Based on skills match</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`p-4 rounded-lg ${
            darkMode ? 'bg-surface-700' : 'bg-surface-50'
          }`}
        >
          <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
            Failed Applications
          </p>
          <p className="text-2xl font-bold mb-4">{stats.failedApplications}</p>
          <div className="flex items-center text-sm">
            <XCircle className="w-4 h-4 text-red-500 mr-1" />
            <span>Requires attention</span>
          </div>
        </motion.div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">Recent Applications</h4>
        <div className={`rounded-lg overflow-hidden ${
          darkMode ? 'bg-surface-700' : 'bg-surface-50'
        }`}>
          {recentApplications.map((application, index) => (
            <motion.div
              key={application.jobId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 ${
                index !== recentApplications.length - 1
                  ? darkMode ? 'border-b border-surface-600' : 'border-b border-surface-200'
                  : ''
              }`}
            >
              <div className="flex items-center">
                {application.status === 'submitted' && (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                )}
                {application.status === 'pending' && (
                  <Clock className="w-5 h-5 text-primary-500 mr-2" />
                )}
                {application.status === 'failed' && (
                  <XCircle className="w-5 h-5 text-red-500 mr-2" />
                )}
                <div>
                  <p className="font-medium">Application #{application.jobId}</p>
                  <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'}`}>
                    {application.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <p className="text-sm font-medium">Match Score</p>
                  <p className={`text-sm ${
                    application.matchScore > 80
                      ? 'text-green-500'
                      : application.matchScore > 60
                      ? 'text-primary-500'
                      : 'text-red-500'
                  }`}>
                    {application.matchScore}%
                  </p>
                </div>
                <div className="w-8 h-8">
                  <CircularProgressbar
                    value={application.matchScore}
                    styles={buildStyles({
                      pathColor: application.matchScore > 80
                        ? '#22c55e'
                        : application.matchScore > 60
                        ? '#0ea5e9'
                        : '#ef4444',
                      trailColor: darkMode ? '#1e293b' : '#f1f5f9',
                    })}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutomationDashboard;