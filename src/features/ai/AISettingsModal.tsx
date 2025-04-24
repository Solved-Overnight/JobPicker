import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AIProvider, AISettings } from '../../types';

interface AISettingsModalProps {
  aiSettings: AISettings;
  onSave: (provider: AIProvider, apiKey?: string) => void;
  onClose: () => void;
  darkMode: boolean;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({
  aiSettings,
  onSave,
  onClose,
  darkMode
}) => {
  const [provider, setProvider] = useState<AIProvider>(aiSettings.provider);
  const [apiKey, setApiKey] = useState<string>(aiSettings.apiKey || '');
  const [showApiKeyField, setShowApiKeyField] = useState(!!aiSettings.apiKey);
  
  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProvider(e.target.value as AIProvider);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(provider, showApiKeyField ? apiKey : undefined);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`w-full max-w-md rounded-xl shadow-xl 
          ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}
          overflow-hidden transform transition-all`}
      >
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h3 className="text-lg font-medium">AI Provider Settings</h3>
          <button
            onClick={onClose}
            className={`rounded-full p-1 
              ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}
              transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select AI Provider</label>
            <div className="space-y-2">
              {['openai', 'google', 'github'].map((option) => (
                <label 
                  key={option} 
                  className={`flex items-center p-3 rounded-lg cursor-pointer
                    ${provider === option 
                      ? darkMode 
                        ? 'bg-blue-900 bg-opacity-30 border border-blue-500' 
                        : 'bg-blue-50 border border-blue-300'
                      : darkMode
                        ? 'bg-slate-700 border border-slate-600 hover:bg-slate-600'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    } transition-colors`}
                >
                  <input
                    type="radio"
                    name="aiProvider"
                    value={option}
                    checked={provider === option}
                    onChange={handleProviderChange}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center border ${
                    provider === option
                      ? darkMode ? 'border-blue-400' : 'border-blue-500'
                      : darkMode ? 'border-gray-500' : 'border-gray-400'
                  }`}>
                    {provider === option && (
                      <div className={`w-2 h-2 rounded-full ${
                        darkMode ? 'bg-blue-400' : 'bg-blue-500'
                      }`}></div>
                    )}
                  </div>
                  <span className="capitalize">{option === 'openai' ? 'OpenAI' : option === 'github' ? 'GitHub Copilot' : 'Google AI'}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">API Key</label>
              <button
                type="button"
                onClick={() => setShowApiKeyField(!showApiKeyField)}
                className={`text-sm ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                } transition-colors`}
              >
                {showApiKeyField ? 'Use Default' : 'Add Custom Key'}
              </button>
            </div>
            
            {showApiKeyField ? (
              <div className="space-y-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors`}
                  placeholder={`Enter your ${provider === 'openai' ? 'OpenAI' : provider === 'github' ? 'GitHub' : 'Google AI'} API key`}
                />
                <div className={`flex items-start text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <AlertCircle className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>Your API key is securely stored in your browser and is never sent to our servers.</span>
                </div>
              </div>
            ) : (
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Using default service for demo purposes. Add your own API key for production use.
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
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