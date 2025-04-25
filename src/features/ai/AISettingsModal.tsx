import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Key } from 'lucide-react'; // Added Key icon
import { AIProvider, AISettings } from '../../types';

interface AISettingsModalProps {
  aiSettings: AISettings;
  jobSearchApiKeyInitial: string | undefined; // Receive initial job search key
  onSave: (aiProvider: AIProvider, aiApiKey?: string, jobSearchApiKey?: string) => void; // Updated signature
  onClose: () => void;
  darkMode: boolean;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({
  aiSettings,
  jobSearchApiKeyInitial,
  onSave,
  onClose,
  darkMode
}) => {
  const [provider, setProvider] = useState<AIProvider>(aiSettings.provider);
  const [aiApiKey, setAiApiKey] = useState<string>(aiSettings.apiKey || '');
  const [jobSearchApiKey, setJobSearchApiKey] = useState<string>(jobSearchApiKeyInitial || ''); // State for job search key
  const [showAiApiKeyField, setShowAiApiKeyField] = useState(!!aiSettings.apiKey);
  const [showJobSearchApiKeyField, setShowJobSearchApiKeyField] = useState(!!jobSearchApiKeyInitial); // Control visibility

  // Sync state if props change externally (e.g., after saving)
  useEffect(() => {
    setProvider(aiSettings.provider);
    setAiApiKey(aiSettings.apiKey || '');
    setShowAiApiKeyField(!!aiSettings.apiKey);
  }, [aiSettings]);

  useEffect(() => {
    setJobSearchApiKey(jobSearchApiKeyInitial || '');
    setShowJobSearchApiKeyField(!!jobSearchApiKeyInitial);
  }, [jobSearchApiKeyInitial]);


  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvider(e.target.value as AIProvider);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      provider,
      showAiApiKeyField ? aiApiKey : undefined,
      showJobSearchApiKeyField ? jobSearchApiKey : undefined // Pass job search key
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"> {/* Increased opacity */}
      <div
        className={`w-full max-w-lg rounded-xl shadow-xl  /* Increased max-width */
          ${darkMode ? 'bg-surface-800 text-white' : 'bg-white text-slate-900'}
          overflow-hidden transform transition-all border ${darkMode ? 'border-surface-700' : 'border-surface-200'}`} // Added border
      >
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-surface-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h3 className="text-lg font-medium">API & Provider Settings</h3>
          <button
            onClick={onClose}
            className={`rounded-full p-1
              ${darkMode ? 'hover:bg-surface-700' : 'hover:bg-gray-100'}
              transition-colors`}
            aria-label="Close settings modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6"> {/* Added space-y */}
          {/* AI Provider Selection */}
          <fieldset>
            <legend className="block text-sm font-medium mb-3">AI Provider (for Analysis)</legend>
            <div className="space-y-2">
              {['openai', 'google', 'github'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center p-3 rounded-lg cursor-pointer border
                    ${provider === option
                      ? darkMode
                        ? 'bg-primary-900 bg-opacity-30 border-primary-500'
                        : 'bg-primary-50 border-primary-300'
                      : darkMode
                        ? 'bg-surface-700 border-surface-600 hover:bg-surface-600'
                        : 'bg-white border-gray-300 hover:bg-gray-50'
                    } transition-colors`}
                >
                  <input
                    type="radio"
                    name="aiProvider"
                    value={option}
                    checked={provider === option}
                    onChange={handleProviderChange}
                    className="sr-only" // Hide actual radio button
                    aria-labelledby={`ai-provider-label-${option}`}
                  />
                  {/* Custom radio button appearance */}
                  <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center border ${provider === option
                      ? darkMode ? 'border-primary-400' : 'border-primary-500'
                      : darkMode ? 'border-gray-500' : 'border-gray-400'
                    }`}>
                    {provider === option && (
                      <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-primary-400' : 'bg-primary-500'}`}></div>
                    )}
                  </div>
                  <span id={`ai-provider-label-${option}`} className="capitalize">{option === 'openai' ? 'OpenAI' : option === 'github' ? 'GitHub Copilot' : 'Google AI'}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* AI Provider API Key */}
          <fieldset>
            <div className="flex justify-between items-center mb-2">
              <legend className="block text-sm font-medium">AI Provider API Key</legend>
              <button
                type="button"
                onClick={() => setShowAiApiKeyField(!showAiApiKeyField)}
                className={`text-xs font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                  } transition-colors`}
              >
                {showAiApiKeyField ? 'Clear & Use Default' : 'Add Custom Key'}
              </button>
            </div>

            {showAiApiKeyField ? (
              <div className="space-y-2">
                <div className="relative">
                  <Key className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="password"
                    value={aiApiKey}
                    onChange={(e) => setAiApiKey(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                        ? 'bg-surface-700 border-surface-600 text-white focus:border-primary-400 placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500 placeholder-gray-500'
                      } focus:ring-1 focus:ring-primary-500 focus:ring-opacity-50 transition-colors`}
                    placeholder={`Enter your ${provider === 'openai' ? 'OpenAI' : provider === 'github' ? 'GitHub' : 'Google AI'} API key`}
                    aria-label="AI Provider API Key"
                  />
                </div>
                <div className={`flex items-start text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Stored securely in your browser's local storage.</span>
                </div>
              </div>
            ) : (
              <div className={`text-sm p-3 rounded-md ${darkMode ? 'bg-surface-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                Using default service (if available) or requires custom key.
              </div>
            )}
          </fieldset>

          {/* Job Search API Key */}
          <fieldset>
            <div className="flex justify-between items-center mb-2">
              <legend className="block text-sm font-medium">Job Search API Key</legend>
              <button
                type="button"
                onClick={() => setShowJobSearchApiKeyField(!showJobSearchApiKeyField)}
                className={`text-xs font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
                  } transition-colors`}
              >
                {showJobSearchApiKeyField ? 'Clear Key' : 'Add API Key'}
              </button>
            </div>

            {showJobSearchApiKeyField ? (
              <div className="space-y-2">
                <div className="relative">
                  <Key className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="password" // Use password type for masking
                    value={jobSearchApiKey}
                    onChange={(e) => setJobSearchApiKey(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                        ? 'bg-surface-700 border-surface-600 text-white focus:border-primary-400 placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500 placeholder-gray-500'
                      } focus:ring-1 focus:ring-primary-500 focus:ring-opacity-50 transition-colors`}
                    placeholder="Enter your Job Search API key"
                    aria-label="Job Search API Key"
                  />
                </div>
                <div className={`flex items-start text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Required for fetching real job listings. Stored in local storage.</span>
                </div>
              </div>
            ) : (
              <div className={`text-sm p-3 rounded-md ${darkMode ? 'bg-surface-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                No custom Job Search API key provided. Job search may be limited or use defaults.
              </div>
            )}
          </fieldset>


          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200 dark:border-surface-700"> {/* Added padding and border */}
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode
                  ? 'bg-surface-700 hover:bg-surface-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                } transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
                } transition-colors`}
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AISettingsModal;
