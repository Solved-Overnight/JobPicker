import { useState, useEffect, useRef, useCallback } from 'react';
import { AIProvider, JobSearchParams, UserPreferences, AutomationStats, ApplicationStatus, SidebarView, JobListing } from './types'; // Added JobListing
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import JobListings from './features/jobResults/JobListings';
import AISettingsModal from './features/ai/AISettingsModal';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal'; // Import LoginModal
import SignUpModal from './components/SignUpModal'; // Import SignUpModal
import { useSystemTheme } from './hooks/useSystemTheme';
import { useAuth } from './context/AuthContext'; // Import useAuth
import ResumeManager from './features/resume/ResumeManager';
import JobSearchPanel from './features/jobSearch/JobSearchPanel'; // Import JobSearchPanel

// Local storage keys
const PREFERENCES_KEY = 'userPreferences_v1';

function App() {
  const systemTheme = useSystemTheme();
  const { user, loading: authLoading } = useAuth(); // Get user from auth context

  // --- State Initialization ---
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    // Load preferences from local storage or set defaults
    const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
    const defaultPrefs: UserPreferences = {
      darkMode: systemTheme === 'dark',
      savedSearches: [],
      aiSettings: { provider: 'openai' },
      jobSearchApiKey: undefined, // Initialize job search API key
      autoApplyEnabled: false,
      applicationPreferences: {
        blacklistedCompanies: [],
        preferredLocations: [],
        remotePreference: 'any'
      }
    };
    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs);
        // Merge saved prefs with defaults to ensure all keys exist
        return { ...defaultPrefs, ...parsedPrefs };
      } catch (e) {
        console.error("Failed to parse saved preferences:", e);
        return defaultPrefs;
      }
    }
    return defaultPrefs;
  });

  const [showSidebar, setShowSidebar] = useState(true); // Keep sidebar open on desktop by default
  const [showAISettings, setShowAISettings] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [activeView, setActiveView] = useState<SidebarView>('dashboard'); // Default to dashboard view/scroll target
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState([
    { id: '1', message: 'New job match found for "Frontend Developer"', unread: true },
    { id: '2', message: 'Application submitted successfully', unread: false }
  ]); // Mock notifications

  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    role: '',
    location: '',
    platforms: [
      { id: '1', name: 'LinkedIn', url: 'https://www.linkedin.com/jobs', enabled: true },
      { id: '2', name: 'Indeed', url: 'https://www.indeed.com', enabled: true },
      { id: '3', name: 'Glassdoor', url: 'https://www.glassdoor.com', enabled: false },
    ]
  });

  const [isSearching, setIsSearching] = useState(false);

  // Mock data (replace with real data fetching later)
  const automationStats: AutomationStats = {
    totalApplications: 50,
    successfulApplications: 35,
    failedApplications: 15,
    averageMatchScore: 78.5,
  };
  const recentApplications: ApplicationStatus[] = [
    { jobId: '123', timestamp: new Date(), status: 'submitted', matchScore: 85 },
    { jobId: '456', timestamp: new Date(), status: 'pending', matchScore: 62 },
    { jobId: '789', timestamp: new Date(), status: 'failed', matchScore: 45 },
  ];

  // --- Effects ---

  // Save preferences to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(userPreferences));
  }, [userPreferences]);

  // Adjust sidebar visibility on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setShowSidebar(true); // Keep open on desktop
      } else {
        setShowSidebar(false); // Default to closed on mobile
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect to handle scrolling *after* the view state has updated
  useEffect(() => {
    if (activeView === 'scroll-dashboard') {
      scrollToSection('automation-dashboard-section');
    } else if (activeView === 'scroll-job-search') {
      scrollToSection('job-search-section');
    }
    // Add other scroll targets if needed (e.g., 'resume-manager')
    else if (activeView === 'resume-manager') {
       scrollToSection('resume-manager-section'); // Assuming this ID exists
    }
  }, [activeView]);

  // --- Event Handlers ---

  const handleSearch = (params: JobSearchParams) => {
    setSearchParams(params);
    setIsSearching(true);
    // Switch to the job search view/scroll target when a search is initiated
    setActiveView('job-search');
    // Scroll will be handled by the useEffect watching activeView
  };

  // Updated to handle both AI and Job Search API keys
  const updateSettings = useCallback((aiProvider: AIProvider, aiApiKey?: string, jobSearchApiKey?: string) => {
    setUserPreferences(prev => ({
      ...prev,
      aiSettings: {
        provider: aiProvider,
        apiKey: aiApiKey // Store AI key in preferences state
      },
      jobSearchApiKey: jobSearchApiKey // Store job search key in preferences state
    }));
    setShowAISettings(false);
    console.log("Settings updated. AI Key:", aiApiKey ? 'Provided' : 'Not Provided', "Job Key:", jobSearchApiKey ? 'Provided' : 'Not Provided');
  }, []);


  const toggleDarkMode = useCallback(() => {
    setUserPreferences(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  }, []);

  const scrollToSection = (sectionId: string) => {
    requestAnimationFrame(() => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn(`Scroll target element with ID "${sectionId}" not found.`);
      }
    });
  };

  const handleSidebarNavigation = useCallback((view: SidebarView) => {
    const isMobile = window.innerWidth < 768;
    setActiveView(view); // Always update the active view

    // Close sidebar on mobile after any navigation action
    if (isMobile) {
      setShowSidebar(false);
    }
    // Scrolling is handled by the useEffect watching activeView
  }, []);


  // --- Auth Modal Handlers ---
  const openLoginModal = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };
  const openSignUpModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };
  const closeAuthModals = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
  };

  // --- Render Logic ---

  // Determine which main content to show based on activeView
  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard
            searchParams={searchParams}
            onSearch={handleSearch}
            stats={automationStats}
            recentApplications={recentApplications}
            darkMode={userPreferences.darkMode}
            activeView={activeView} // Pass active view
            onViewChange={handleSidebarNavigation} // Allow Dashboard tabs to change view
          />
        );
      case 'job-search':
        return (
          <>
            <JobSearchPanel
              searchParams={searchParams}
              onSearch={handleSearch}
              darkMode={userPreferences.darkMode}
            />
            {isSearching && (
              <div id="job-listings-section" className="mt-6">
                <JobListings
                  searchParams={searchParams}
                  darkMode={userPreferences.darkMode}
                  jobSearchApiKey={userPreferences.jobSearchApiKey} // Pass API key
                />
              </div>
            )}
          </>
        );
      case 'resume-analyzer':
        return (
          <ResumeManager darkMode={userPreferences.darkMode} />
        );
      case 'saved-jobs':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Saved Jobs</h2>
            {/* TODO: Implement Saved Jobs component */}
            <p>Saved Jobs content goes here. Requires user login.</p>
          </div>
        );
      case 'settings':
         return (
           <div className="p-6">
             <h2 className="text-2xl font-bold mb-4">Application Settings</h2>
             {/* TODO: Implement Settings component */}
             <p>Application settings content goes here. (e.g., Blacklisted companies, location preferences)</p>
             <button onClick={() => setShowAISettings(true)} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600">
               Open API & Provider Settings
             </button>
           </div>
         );
      default:
        return (
          <Dashboard
            searchParams={searchParams}
            onSearch={handleSearch}
            stats={automationStats}
            recentApplications={recentApplications}
            darkMode={userPreferences.darkMode}
            activeView={'dashboard'} // Default to dashboard section
            onViewChange={handleSidebarNavigation}
          />
        );
    }
  };


  return (
    <div className={`min-h-screen flex flex-col ${userPreferences.darkMode
        ? 'bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 text-white'
        : 'bg-gradient-to-br from-surface-50 via-white to-surface-100 text-slate-900'
      } animate-gradient-xy`}>
      <Header
        onAISettingsClick={() => setShowAISettings(true)}
        darkMode={userPreferences.darkMode}
        onToggleDarkMode={toggleDarkMode}
        onMenuToggle={() => setShowSidebar(!showSidebar)}
        notifications={notifications}
        onLoginClick={openLoginModal} // Pass handler
        onSignUpClick={openSignUpModal} // Pass handler
      />

      <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
        <Sidebar
          darkMode={userPreferences.darkMode}
          savedSearches={userPreferences.savedSearches}
          isVisible={showSidebar}
          onClose={() => setShowSidebar(false)}
          onNavigate={handleSidebarNavigation}
          activeView={activeView}
        />

        {/* Main content area with scrolling */}
        <main ref={mainContentRef} className="flex-grow overflow-y-auto p-6"> {/* Added padding */}
          {renderMainContent()}
        </main>
      </div>

      <Footer darkMode={userPreferences.darkMode} />

      {/* Modals */}
      {showAISettings && (
        <AISettingsModal
          aiSettings={userPreferences.aiSettings}
          jobSearchApiKeyInitial={userPreferences.jobSearchApiKey} // Pass initial key
          onSave={updateSettings} // Use updated handler
          onClose={() => setShowAISettings(false)}
          darkMode={userPreferences.darkMode}
        />
      )}
      {showLoginModal && (
        <LoginModal
          onClose={closeAuthModals}
          onSwitchToSignUp={openSignUpModal}
          darkMode={userPreferences.darkMode}
        />
      )}
      {showSignUpModal && (
        <SignUpModal
          onClose={closeAuthModals}
          onSwitchToLogin={openLoginModal}
          darkMode={userPreferences.darkMode}
        />
      )}
    </div>
  );
}

export default App;
