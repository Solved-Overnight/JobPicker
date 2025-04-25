import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { X, Mail, Lock } from 'lucide-react';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToSignUp: () => void; // Function to switch to SignUp modal
  darkMode: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onSwitchToSignUp, darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose(); // Close modal on successful login
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md rounded-xl shadow-xl 
          ${darkMode ? 'bg-surface-800 text-white' : 'bg-white text-slate-900'}
          overflow-hidden transform transition-all`}
      >
        <div className={`px-6 py-4 border-b ${darkMode ? 'border-surface-700' : 'border-gray-200'} flex justify-between items-center`}>
          <h3 className="text-lg font-medium">Log In</h3>
          <button
            onClick={onClose}
            className={`rounded-full p-1 
              ${darkMode ? 'hover:bg-surface-700' : 'hover:bg-gray-100'}
              transition-colors`}
            aria-label="Close login modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className={`p-3 rounded-md text-sm ${darkMode ? 'bg-red-900 bg-opacity-50 text-red-300' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}
          <div className="relative">
            <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                  ? 'bg-surface-700 border-surface-600 text-white focus:border-primary-400 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500 placeholder-gray-500'
                } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors`}
            />
          </div>
          <div className="relative">
            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                  ? 'bg-surface-700 border-surface-600 text-white focus:border-primary-400 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-primary-500 placeholder-gray-500'
                } focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 transition-colors`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${darkMode
                ? 'bg-primary-600 hover:bg-primary-700 text-white disabled:bg-primary-800'
                : 'bg-primary-500 hover:bg-primary-600 text-white disabled:bg-primary-300'
              }`}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignUp}
              className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
