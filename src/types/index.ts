export interface JobSearchParams {
  role: string;
  location?: string;
  platforms: JobPlatform[];
}

export interface JobPlatform {
  id: string;
  name: string;
  url: string;
  topic?: string; // Add topic
  enabled: boolean;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  platform: string;
  url: string;
  postedDate?: string;
  matchScore?: number;
  isSaved?: boolean;
  summary?: string; // Add summary
}

export interface UserPreferences {
  darkMode: boolean;
  savedSearches: JobSearchParams[];
  aiSettings: AISettings;
  jobSearchApiKey?: string;
  autoApplyEnabled: boolean;
  applicationPreferences: ApplicationPreferences;
}

export interface AISettings {
  provider: AIProvider;
  apiKey?: string;
}

export type AIProvider = 'openai' | 'google' | 'github';

export interface ApplicationPreferences {
  blacklistedCompanies: string[];
  preferredLocations: string[];
  remotePreference: 'any' | 'remote' | 'hybrid';
}

export interface AutomationStats {
  totalApplications: number;
  successfulApplications: number;
  failedApplications: number;
  averageMatchScore: number;
}

export interface ApplicationStatus {
  jobId: string;
  timestamp: Date;
  status: string;
  matchScore: number;
}

export type SidebarView =
  | 'dashboard'
  | 'job-search'
  | 'resume-analyzer'
  | 'saved-jobs'
  | 'settings'
  | 'scroll-dashboard'
  | 'scroll-job-search'
  | 'resume-manager';
