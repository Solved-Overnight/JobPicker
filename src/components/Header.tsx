import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Search, Bell, User, Menu, X } from 'lucide-react';
import { useSystemTheme } from '../hooks/useSystemTheme';

interface HeaderProps {
  onAISettingsClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onMenuToggle: () => void;
  notifications?: { id: string; message: string; unread: boolean }[];
}

const Header: React.FC<HeaderProps> = ({ 
  onAISettingsClick,
  darkMode,
  onToggleDarkMode,
  onMenuToggle,
  notifications = []
}) => {
  const systemTheme = useSystemTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Sync with system theme on mount and when system theme changes
    if (darkMode !== (systemTheme === 'dark')) {
      onToggleDarkMode();
    }
  }, [systemTheme]);

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <header className={`py-4 px-6 ${
      darkMode 
        ? 'bg-gradient-to-r from-surface-900 via-surface-800 to-surface-900' 
        : 'bg-gradient-to-r from-white via-surface-50 to-white'
    } shadow-lg animate-gradient-x`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <Search className={`w-6 h-6 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
            <h1 className="text-xl font-bold">AI Job Hunter</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg ${
                    darkMode ? 'bg-surface-800' : 'bg-white'
                  } z-50`}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                    {notifications.length > 0 ? (
                      <div className="space-y-2">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-2 rounded-lg ${
                              notification.unread
                                ? darkMode 
                                  ? 'bg-surface-700' 
                                  : 'bg-surface-100'
                                : ''
                            }`}
                          >
                            {notification.message}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm ${
                        darkMode ? 'text-surface-400' : 'text-surface-500'
                      }`}>
                        No new notifications
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-surface-700" />
              )}
            </motion.div>
          </button>
          
          <button
            onClick={onAISettingsClick}
            className={`p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors`}
            aria-label="AI Settings"
          >
            <Settings className={`w-5 h-5 ${darkMode ? 'text-surface-300' : 'text-surface-700'}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                    darkMode ? 'bg-surface-800' : 'bg-white'
                  } z-50`}
                >
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      Settings
                    </button>
                    <hr className={darkMode ? 'border-surface-700' : 'border-surface-200'} />
                    <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;