import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, PlusCircle, MinusCircle, Briefcase, MapPin, Settings, Globe } from 'lucide-react';
import { JobPlatform, JobSearchParams } from '../../types';

interface JobSearchPanelProps {
  searchParams: JobSearchParams;
  onSearch: (params: JobSearchParams) => void;
  darkMode: boolean;
}

const JobSearchPanel: React.FC<JobSearchPanelProps> = ({
  searchParams,
  onSearch,
  darkMode
}) => {
  const [role, setRole] = useState(searchParams.role);
  const [location, setLocation] = useState(searchParams.location || '');
  const [platforms, setPlatforms] = useState<JobPlatform[]>(searchParams.platforms);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformUrl, setNewPlatformUrl] = useState('');
  const [newPlatformTopic, setNewPlatformTopic] = useState(''); // New state for topic
  const [showAddPlatform, setShowAddPlatform] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      role,
      location,
      platforms
    });
  };

  const togglePlatform = (id: string) => {
    setPlatforms(platforms.map(platform =>
      platform.id === id
        ? { ...platform, enabled: !platform.enabled }
        : platform
    ));
  };

  const addPlatform = () => {
    if (newPlatformName && newPlatformUrl && newPlatformTopic) {
      setPlatforms([
        ...platforms,
        {
          id: Date.now().toString(),
          name: newPlatformName,
          url: newPlatformUrl,
          topic: newPlatformTopic, // Include topic
          enabled: true
        }
      ]);
      setNewPlatformName('');
      setNewPlatformUrl('');
      setNewPlatformTopic(''); // Clear topic
      setShowAddPlatform(false);
    }
  };

  const removePlatform = (id: string) => {
    setPlatforms(platforms.filter(platform => platform.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-surface-800' : 'bg-white'
        }`}
    >
      <div className={`px-6 py-4 ${darkMode
        ? 'bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900'
        : 'bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500'
        } animate-gradient-x`}>
        <h2 className="text-xl font-bold flex items-center text-white">
          <Search className="w-5 h-5 mr-2" />
          Job Search
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="role"
              className={`block text-sm font-medium mb-2 flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Job Role*
            </label>
            <input
              id="role"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className={`w-full px-4 py-2 rounded-lg border ${darkMode
                ? 'bg-surface-700 border-surface-600 text-white focus:border-primary-400'
                : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
                } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors`}
              required
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className={`block text-sm font-medium mb-2 flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Location (Optional)
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, NY"
              className={`w-full px-4 py-2 rounded-lg border ${darkMode
                ? 'bg-surface-700 border-surface-600 text-white focus:border-primary-400'
                : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500'
                } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors`}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className={`block text-sm font-medium flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
              <Settings className="w-4 h-4 mr-2" />
              Job Platforms
            </label>
            <button
              type="button"
              onClick={() => setShowAddPlatform(!showAddPlatform)}
              className={`text-sm flex items-center ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                } transition-colors`}
            >
              {showAddPlatform ? (
                <>
                  <MinusCircle className="w-4 h-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Platform
                </>
              )}
            </button>
          </div>

          {showAddPlatform && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-lg bg-opacity-50 bg-primary-50 dark:bg-surface-700"
            >
              <input
                type="text"
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                placeholder="Platform Name"
                className={`px-4 py-2 rounded-lg border ${darkMode
                  ? 'bg-surface-600 border-surface-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors`}
              />
              <div className="flex">
                <input
                  type="text"
                  value={newPlatformUrl}
                  onChange={(e) => setNewPlatformUrl(e.target.value)}
                  placeholder="URL (e.g. https://example.com)"
                  className={`flex-grow px-4 py-2 rounded-l-lg border-y border-l ${darkMode
                    ? 'bg-surface-600 border-surface-500 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors`}
                />
                <input
                  type="text"
                  value={newPlatformTopic}
                  onChange={(e) => setNewPlatformTopic(e.target.value)}
                  placeholder="Topic (e.g. javascript)"
                  className={`flex-grow px-4 py-2 rounded-r-lg border-y border-r ${darkMode
                    ? 'bg-surface-600 border-surface-500 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors`}
                />
                <button
                  type="button"
                  onClick={addPlatform}
                  className={`px-4 rounded-r-lg ${darkMode
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                    } transition-colors`}
                >
                  Add
                </button>
              </div>
            </motion.div>
          )}

          <div className="space-y-2 mt-2">
            {platforms.map(platform => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center justify-between p-3 rounded-lg ${platform.enabled
                  ? darkMode
                    ? 'bg-surface-700 border border-surface-600'
                    : 'bg-primary-50 border border-primary-100'
                  : darkMode
                    ? 'bg-surface-800 opacity-60 border border-surface-700'
                    : 'bg-gray-100 opacity-75 border border-gray-200'
                  } transition-all`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`platform-${platform.id}`}
                    checked={platform.enabled}
                    onChange={() => togglePlatform(platform.id)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label
                    htmlFor={`platform-${platform.id}`}
                    className="ml-2 cursor-pointer"
                  >
                    {platform.name} - {platform.topic}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => removePlatform(platform.id)}
                  className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                    } transition-colors`}
                >
                  Remove
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`px-6 py-2 rounded-lg font-medium ${darkMode
              ? 'bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-700 hover:via-primary-600 hover:to-primary-700 text-white'
              : 'bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 hover:from-primary-600 hover:via-primary-500 hover:to-primary-600 text-white'
              } shadow-lg hover:shadow-xl transition-all animate-gradient-x focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            Search Jobs
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobSearchPanel;
