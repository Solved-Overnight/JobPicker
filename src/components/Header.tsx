import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Moon, Sun, Search, Bell, User, Menu, X, LogIn, LogOut } from 'lucide-react'; // Added LogIn, LogOut
import { useSystemTheme } from '../hooks/useSystemTheme';
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface HeaderProps {
  onAISettingsClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onMenuToggle: () => void;
  notifications?: { id: string; message: string; unread: boolean }[];
  onLoginClick: () => void; // Add handler for login click
  onSignUpClick: () => void; // Add handler for sign up click
}

const Header: React.FC<HeaderProps> = ({
  onAISettingsClick,
  darkMode,
  onToggleDarkMode,
  onMenuToggle,
  notifications = [],
  onLoginClick,
  onSignUpClick
}) => {
  const systemTheme = useSystemTheme();
  const { user, signOut, loading: authLoading } = useAuth(); // Get user and signOut from context
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Removed the useEffect that synced darkMode with systemTheme
  // Let the App component manage the initial dark mode state based on systemTheme

  const unreadNotifications = notifications.filter(n => n.unread).length;

  const handleSignOut = async () => {
    setShowUserMenu(false); // Close menu first
    await signOut();
  };

  return (
    <header className={`py-4 px-6 ${darkMode
        ? 'bg-gradient-to-r from-surface-900 via-surface-800 to-surface-900'
        : 'bg-gradient-to-r from-white via-surface-50 to-white'
      } shadow-lg animate-gradient-x sticky top-0 z-10`}> {/* Added sticky top-0 z-10 */}
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center space-x-2 cursor-default"> {/* Added cursor-default */}
            <Search className={`w-6 h-6 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
            <h1 className="text-xl font-bold">AI Job Hunter</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4"> {/* Adjusted spacing */}
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors relative"
              aria-label="Toggle notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center text-[10px]"> {/* Adjusted position and size */}
                  {unreadNotifications}
                </span>
              )}
            </button>
            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg ${darkMode ? 'bg-surface-800' : 'bg-white'
                    } z-50 border ${darkMode ? 'border-surface-700' : 'border-surface-200'}`} // Added border
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                    {notifications.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto"> {/* Added max-height and scroll */}
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-2 rounded-lg text-sm ${notification.unread
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
                      <p className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-500'
                        }`}>
                        No new notifications
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-surface-700" />
              )}
            </motion.div>
          </button>

          {/* AI Settings Button */}
          <button
            onClick={onAISettingsClick}
            className={`p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors`}
            aria-label="AI Settings"
          >
            <Settings className={`w-5 h-5 ${darkMode ? 'text-surface-300' : 'text-surface-700'}`} />
          </button>

          {/* Auth Buttons / User Menu */}
          <div className="relative">
            {authLoading ? (
              <div className="p-2">
                <div className={`w-5 h-5 border-2 ${darkMode ? 'border-surface-600 border-t-primary-400' : 'border-surface-300 border-t-primary-500'} rounded-full animate-spin`}></div>
              </div>
            ) : user ? (
              // User is logged in - Show User Menu
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center" // Adjusted padding
                  aria-label="User menu"
                >
                  {/* Placeholder for user avatar - replace with actual image if available */}
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center ${darkMode ? 'bg-primary-700' : 'bg-primary-500'} text-white text-xs font-medium`}>
                    {user.email ? user.email[0].toUpperCase() : <User className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${darkMode ? 'bg-surface-800' : 'bg-white'
                        } z-50 border ${darkMode ? 'border-surface-700' : 'border-surface-200'}`} // Added border
                      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700 mb-2">
                          <p className="text-sm font-medium truncate" title={user.email || undefined}>
                            {user.email || 'User'}
                          </p>
                        </div>
                        <button className="w-full text-left px-4 py-2 text-sm hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors flex items-center">
                          <User className="w-4 h-4 mr-2" /> Profile
                        </button>
                        {/* Add other user-specific actions here */}
                        <hr className={darkMode ? 'border-surface-700 my-1' : 'border-surface-200 my-1'} />
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-30 transition-colors flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              // User is logged out - Show Login/Sign Up Buttons
              <div className="flex items-center space-x-2">
                <button
                  onClick={onLoginClick}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${darkMode
                      ? 'text-primary-400 hover:bg-surface-700'
                      : 'text-primary-600 hover:bg-primary-50'
                    }`}
                >
                  Log In
                </button>
                <button
                  onClick={onSignUpClick}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${darkMode
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-primary-500 hover:bg-primary-600 text-white'
                    }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
