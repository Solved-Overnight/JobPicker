import { useState, useEffect } from 'react';
import { AIProvider, JobSearchParams, UserPreferences, AutomationStats, ApplicationStatus } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import JobListings from './features/jobResults/JobListings';
import AISettingsModal from './features/ai/AISettingsModal';
import Footer from './components/Footer';
import { useSystemTheme } from './hooks/useSystemTheme';

function App() {
  const systemTheme = useSystemTheme();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAISettings, setShowAISettings] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    darkMode: systemTheme === 'dark',
    savedSearches: [],
    aiSettings: {
      provider: 'openai' as AIProvider
    },
    autoApplyEnabled: false,
    applicationPreferences: {
      blacklistedCompanies: [],
      preferredLocations: [],
      remotePreference: 'any'
    }
  });

  const [notifications] = useState([
    {
      id: '1',
      message: 'New job match found for "Frontend Developer"',
      unread: true
    },
    {
      id: '2',
      message: 'Application submitted successfully',
      unread: false
    }
  ]);

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

  // Mock automation stats for demonstration
  const automationStats: AutomationStats = {
    totalApplications: 45,
    successfulApplications: 32,
    failedApplications: 13,
    averageMatchScore: 78.5,
    applicationsByPlatform: {
      LinkedIn: 20,
      Indeed: 15,
      Glassdoor: 10
    },
    applicationsByDay: {
      '2024-02-01': 5,
      '2024-02-02': 8,
      '2024-02-03': 12
    }
  };

  // Mock recent applications
  const recentApplications: ApplicationStatus[] = [
    {
      jobId: '1',
      status: 'submitted',
      timestamp: new Date(),
      matchScore: 85
    },
    {
      jobId: '2',
      status: 'pending',
      timestamp: new Date(Date.now() - 86400000),
      matchScore: 72
    },
    {
      jobId: '3',
      status: 'failed',
      timestamp: new Date(Date.now() - 172800000),
      matchScore: 45,
      error: 'Application form not accessible'
    }
  ];

  const handleSearch = (params: JobSearchParams) => {
    setSearchParams(params);
    setIsSearching(true);
  };

  const updateAISettings = (provider: AIProvider, apiKey?: string) => {
    setUserPreferences({
      ...userPreferences,
      aiSettings: {
        provider,
        apiKey
      }
    });
    setShowAISettings(false);
  };

  const toggleDarkMode = () => {
    setUserPreferences({
      ...userPreferences,
      darkMode: !userPreferences.darkMode
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${
      userPreferences.darkMode 
        ? 'bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 text-white' 
        : 'bg-gradient-to-br from-surface-50 via-white to-surface-100 text-slate-900'
    } animate-gradient-xy`}>
      <Header 
        onAISettingsClick={() => setShowAISettings(true)}
        darkMode={userPreferences.darkMode}
        onToggleDarkMode={toggleDarkMode}
        onMenuToggle={() => setShowSidebar(!showSidebar)}
        notifications={notifications}
      />
      
      <div className="flex flex-col md:flex-row flex-grow">
        <Sidebar 
          darkMode={userPreferences.darkMode}
          savedSearches={userPreferences.savedSearches}
          isVisible={showSidebar}
          onClose={() => setShowSidebar(false)}
        />
        
        <main className="flex-grow">
          <Dashboard
            searchParams={searchParams}
            onSearch={handleSearch}
            stats={automationStats}
            recentApplications={recentApplications}
            darkMode={userPreferences.darkMode}
          />
          
          {isSearching && (
            <div className="px-6 pb-6">
              <JobListings 
                searchParams={searchParams}
                darkMode={userPreferences.darkMode}
              />
            </div>
          )}
        </main>
      </div>
      
      <Footer darkMode={userPreferences.darkMode} />
      
      {showAISettings && (
        <AISettingsModal
          aiSettings={userPreferences.aiSettings}
          onSave={updateAISettings}
          onClose={() => setShowAISettings(false)}
          darkMode={userPreferences.darkMode}
        />
      )}
    </div>
  );
}

export default App;