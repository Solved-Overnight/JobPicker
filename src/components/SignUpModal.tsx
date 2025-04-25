import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react'; // Renamed User to UserIcon

interface SignUpModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void; // Function to switch to Login modal
  darkMode: boolean;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose, onSwitchToLogin, darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Optionally update profile here if needed
      onClose(); // Close modal on successful sign up
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
      console.error("Sign up error:", err);
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
          <h3 className="text-lg font-medium">Sign Up</h3>
          <button
            onClick={onClose}
            className={`rounded-full p-1 
              ${darkMode ? 'hover:bg-surface-700' : 'hover:bg-gray-100'}
              transition-colors`}
            aria-label="Close sign up modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSignUp} className="p-6 space-y-4">
          {error && (
            <div className={`p-3 rounded-md text-sm ${darkMode ? 'bg-red-900 bg-opacity-50 text-red-300' : 'bg-red-100 text-red-700'}`}>
              {error}
            </div>
          )}
          {/* Optional: Add Name field if needed */}
          {/* <div className="relative">
            <UserIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input type="text" placeholder="Full Name" className={inputClasses} />
          </div> */}
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
              placeholder="Password (min. 6 characters)"
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
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
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'}`}
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpModal;
