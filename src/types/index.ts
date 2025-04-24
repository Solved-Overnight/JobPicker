export type AIProvider = 'google' | 'openai' | 'github';

export interface AISettings {
  provider: AIProvider;
  apiKey?: string;
}

export interface JobPlatform {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}

export interface JobSearchParams {
  role: string;
  location?: string;
  platforms: JobPlatform[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  postedDate: string;
  platform: string;
  logoUrl?: string;
  applyUrl: string;
  skills?: string[];
  saved: boolean;
  applied: boolean;
  matchScore?: number;
  applicationStatus?: 'pending' | 'submitted' | 'failed';
}

export interface Resume {
  id: string;
  name: string;
  content: string;
  skills: string[];
  experience: string[];
  education: string[];
  lastModified: Date;
}

export interface UserPreferences {
  darkMode: boolean;
  savedSearches: JobSearchParams[];
  aiSettings: AISettings;
  autoApplyEnabled: boolean;
  resume?: Resume;
  applicationPreferences: {
    coverLetterTemplate?: string;
    blacklistedCompanies: string[];
    desiredSalaryRange?: {
      min: number;
      max: number;
    };
    preferredLocations: string[];
    remotePreference: 'remote-only' | 'hybrid' | 'on-site' | 'any';
  };
}

export interface ApplicationStatus {
  jobId: string;
  status: 'pending' | 'submitted' | 'failed';
  timestamp: Date;
  error?: string;
  matchScore: number;
}

export interface AutomationStats {
  totalApplications: number;
  successfulApplications: number;
  failedApplications: number;
  averageMatchScore: number;
  applicationsByPlatform: Record<string, number>;
  applicationsByDay: Record<string, number>;
}